const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const connectdb = require("./config/connectDb");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
dotenv.config();

connectdb();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(express.urlencoded());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Server is on PORT " + PORT);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// let users = [];
// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users.filter(
//     (user) => user.socketId !== socketId
//   );
// };

// const getUser = (id) => {
//   return users.find((user) => user.userId === id);
// };

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    socket.join(userId);
    console.log("user join ✔✔✔");
  });

  socket.on("addChat", (chat) => {
    socket.join(chat);
    console.log("join to chat room🌮🌮");
  });
  console.log(socket.rooms);

  socket.on(
    "sendMessage",
    ({ sender, message, receiver }) => {
      io.in(receiver).emit("getMessage", {
        sender,
        message,
        receiver,
      });
    }
  );

  socket.on("typing", (chat) => {
    io.in(chat).emit("typing");
  });
  socket.on("stop typing", (chat) => {
    io.in(chat).emit("stop typing");
  });

  socket.on("leaveUser", (userId) => {
    socket.leave(userId);
    console.log("leave user 🙋‍♀️🙋‍♀️🙋‍♀️");
  });

  socket.on("leaveroom", (roomId) => {
    socket.leave(roomId);
    console.log("leave from chatroom 😢😢😢");
  });

  socket.on("disconnect", () => {
    console.log("disconnected..");
  });
});
