const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socketEventHandler = require("./socket");
const router = require("./routes");
const handleError = require("./middlewares/handleError");
const app = express();
const socket = require("socket.io");
const connectDatabase = require("./configs/connectDBConfig");
require("dotenv").config();

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
  socketEventHandler(socket, io);
});
