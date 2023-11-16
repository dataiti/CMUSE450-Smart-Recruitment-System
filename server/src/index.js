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

  socket.on("user_list_conversations", async ({ userId }) => {
    try {
      const existingConversations = await Message.find({
        userId,
      })
        .sort("updatedAt")
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      const formatData = existingConversations.map((conversation) => {
        return {
          _id: conversation._id,
          employerId: conversation.employerId,
          lastMessage: conversation.messages[conversation.messages.length - 1],
        };
      });

      socket.emit("user_get_list_conversations", {
        message: formatData,
      });
    } catch (error) {}
  });

  socket.on("employer_list_conversations", async ({ employerId }) => {
    try {
      const existingConversations = await Message.find({
        employerId,
      })
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      const formatData = existingConversations.map((conversation) => {
        return {
          _id: conversation._id,
          userId: conversation.userId,
          lastMessage: conversation.messages[conversation.messages.length - 1],
        };
      });

      socket.emit("employer_get_list_conversations", {
        message: formatData,
      });
    } catch (error) {}
  });

  socket.on("start_conversation", async (message) => {
    try {
      const { employerId, userId } = message;

      const existingConversations = await Message.find({
        employerId,
        userId,
      })
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      if (existingConversations.length === 0) {
        let newChat = await Message.create({
          employerId,
          userId,
        });

        newChat = await Message.findById(newChat)
          .populate("userId", "firstName lastName avatar email")
          .populate("employerId", "companyLogo companyName companyEmail");

        socket.emit("start_chat", { success: true, message: newChat });
      } else {
        socket.emit("start_chat", {
          success: true,
          message: existingConversations[0],
        });
      }
    } catch (error) {}
  });

  socket.on("get_messages", async (data) => {
    try {
      const { messageId } = data;
      const messages = await Message.findById(messageId)
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      socket.emit("user_get_message", {
        success: true,
        message: messages,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("text_message", async (message) => {
    try {
      const { sender, content, employerId, userId, type, messageId } = message;

      const findEmployer = await Employer.findById(employerId);
      const findUser = await User.findById(userId);

      const newMessage = {
        sender,
        content,
        type,
        createdAt: Date.now(),
      };

      const findMessage = await Message.findById(messageId)
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");
      findMessage.messages.push(newMessage);

      await findMessage.save({ new: true, validateModifiedOnly: true });

      io.to(findUser?.socketId).emit("new_message", {
        success: true,
        message: findMessage,
      });
      io.to(findEmployer?.socketId).emit("new_message", {
        success: true,
        message: findMessage,
      });
    } catch (error) {}
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

      io.to(employer?.socketId).emit("new_follower", { userId });
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
        (follower) => follower.toString() !== userId.toString()
      );
      await employer.save();

      user.employersFollowing = user.followingIds.filter(
        (employer) => employer.toString() !== employerId.toString()
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
