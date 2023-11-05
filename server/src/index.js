const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Message = require("../src/models/message");
const Employer = require("../src/models/employer");
const User = require("../src/models/user");
const Notification = require("../src/models/notification");
require("dotenv").config();

const router = require("./routes");
const handleError = require("./middlewares/handleError");

const app = express();

const socket = require("socket.io");
const connectDatabase = require("./configs/connectDBConfig");

// connect db
connectDatabase();

// middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// routes
router(app);

// handle error
handleError(app);

// port
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log("✅ Server running on port " + port);
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

// socket
io.on("connection", async (socket) => {
  const userId = socket.handshake.query["userId"];
  const employerId = socket.handshake.query["employerId"];

  if (userId) console.log(`✅ User ${userId} connected socket is successfully`);
  if (employerId)
    console.log(`✅ Employer ${employerId} connected socket is successfully`);

  if (Boolean(userId) && userId !== null) {
    try {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (Boolean(employerId) && employerId !== null) {
    try {
      await Employer.findByIdAndUpdate(employerId, {
        socketId: socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  socket.on("get_direct_conversations", async ({ userId }) => {
    const existingConversations = await Message.find({
      participants: { $all: [userId] },
    }).populate({
      path: "participants",
      model: "User",
      select: "firstName lastName avatar _id email status",
      populate: {
        path: "ownerEmployerId",
        model: "Employer",
        select: "companyLogo companyName companyEmail _id companyPhoneNumber",
      },
    });

    const toUser = await User.findById(userId);

    io.to(toUser?.socketId).emit("user_get_direct_conversations", {
      message: existingConversations,
    });
  });

  socket.on("start_conversation", async (data) => {
    const { from, to } = data;

    const existingConversations = await Message.find({
      participants: { $size: 2, $all: [from, to] },
    }).populate({
      path: "participants",
      model: "User",
      select: "firstName lastName avatar _id email status",
      populate: {
        path: "ownerEmployerId",
        model: "Employer",
        select: "companyLogo companyName companyEmail _id companyPhoneNumber",
      },
    });

    if (existingConversations.length === 0) {
      let newChat = await Message.create({
        participants: [to, from],
      });

      newChat = await Message.findById(newChat).populate(
        "participants",
        "firstName lastName _id avatar email status"
      );

      socket.emit("start_chat", newChat);
    } else {
      socket.emit("start_chat", existingConversations[0]);
    }
  });

  socket.on("get_messages", async (data) => {
    try {
      const { conversationId, userId } = data;
      const messages = await Message.findById(conversationId)
        .populate("participants", "firstName lastName _id avatar email status")
        .populate(
          "messages.to messages.from",
          "firstName lastName _id avatar email status"
        );

      const toUser = await User.findById(userId);

      io.to(toUser?.socketId).emit("user_get_message", {
        message: messages,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("text_message", async (data) => {
    const { message, from, to, type, conversationId } = data;

    const toUser = await User.findById(to);
    const fromUser = await User.findById(from);

    const newMessage = {
      to,
      from,
      type,
      text: message,
      createdAt: Date.now(),
    };

    const chat = await Message.findById(conversationId);
    chat.messages.push(newMessage);

    await chat.save({ new: true, validateModifiedOnly: true });

    const messages = await Message.findById(conversationId).populate(
      "messages.to messages.from",
      "firstName lastName _id avatar email status"
    );

    io.to(toUser?.socketId).emit("new_message", {
      message: messages,
    });
    io.to(fromUser?.socketId).emit("new_message", {
      message: messages,
    });
  });

  socket.on("follow_employer", async (data) => {
    const { userId, employerId } = data;

    try {
      const user = await User.findById(userId);

      const employer = await Employer.findById(employerId);

      if (!user || !employer) return;

      if (employer.followerIds.includes(userId)) return;

      employer.followerIds.push(userId);
      await employer.save();

      user.followingIds.push(employerId);
      await user.save();

      io.to(employer.ownerId.socketId).emit("new_follower", { userId });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("unfollow_employer", async (data) => {
    const { userId, employerId } = data;
    try {
      const user = await User.findById(userId);

      const employer = await Employer.findById(employerId);

      if (!user || !employer) return;

      if (!employer.followerIds.includes(userId)) return;

      employer.followerIds = employer.followerIds.filter(
        (follower) => follower.toString() !== userId
      );
      await employer.save();

      user.employersFollowing = user.employersFollowing.filter(
        (employer) => employer.toString() !== employerId
      );
      await user.save();

      io.to(employer.ownerId.socketId).emit("unfollowed", { userId });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("employer_send_notification", async (message) => {
    const { userId, employerId, title, content, url } = message;
    try {
      const user = await User.findById(userId);

      const employer = await Employer.findById(employerId);

      if (!user || !employer) return;

      const newNotification = new Notification({
        userId,
        employerId,
        title,
        content,
        url,
      });

      const savedNewNotification = await newNotification.save();

      const notificationPopulated = await Notification.findById(
        savedNewNotification._id
      )
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_notification", {
        success: true,
        message: notificationPopulated,
      });

      io.to(employer?.socketId).emit("employer_get_notification", {
        success: true,
        message: notificationPopulated,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("user_view_notification", async (message) => {
    const { notificationId, userId } = message;
    try {
      const user = await User.findById(userId);

      if (!user) return;

      const notificationPopulated = await Notification.findById(notificationId)
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      notificationPopulated.isViewed = true;
      await notificationPopulated.save();

      io.to(user?.socketId).emit("user_viewed_notification", {
        sucess: true,
        message: notificationPopulated,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("get_list_notifications", async (message) => {
    const { userId } = message;
    try {
      const user = await User.findById(userId);

      if (!user) return;

      const listNotifications = await Notification.find({
        userId,
      })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_list_notifications", {
        sucess: true,
        message: listNotifications,
      });
    } catch (error) {
      console.error(error);
    }
  });
});
