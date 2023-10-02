const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Message = require("../src/models/message");
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
    origin: ["http://localhost:3000", "http://localhost:3001"],
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
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// socket
io.on("connection", async (socket) => {
  io.on("get_direct_conversations", async ({ userId }, callback) => {
    const existingConversations = await Message.find({
      participants: { $all: [userId] },
    }).populate("participants", "firstName lastName avatar _id email status");

    callback(existingConversations);
  });

  io.on("start_conversation", async (data) => {
    const { from, to } = data;

    const existingConversations = await Message.find({
      participants: { $size: 2, $all: [from, to] },
    }).populate("participants", "firstName lastName avatar _id email status");

    if (existingConversations.length === 0) {
      let newChat = await Message.create({
        participants: [to, from],
      });

      newChat = await Message.findById(newChat).populate(
        "participants",
        "firstName lastName _id email status"
      );

      socket.emit("start_chat", newChat);
    } else {
      socket.emit("start_chat", existingConversations[0]);
    }
  });

  io.on("get_messages", async (data, callback) => {
    try {
      const { message } = await Message.findById(data.conversationId).select(
        "messages"
      );

      callback(message);
    } catch (error) {
      console.log(error);
    }
  });

  io.on("text_message", async (data) => {
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

    io.to(toUser?.socketId).emit("new_message", {
      conversationId,
      message: newMessage,
    });
    io.to(fromUser?.socketId).emit("new_message", {
      conversationId,
      message: newMessage,
    });
  });
});
