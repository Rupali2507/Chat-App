const express = require("express");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/MsgRoutes");

const socket = require("socket.io");

const { connectToMongoDB } = require("./connection");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.json("Hello");
});
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

connectToMongoDB(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected succesfully...");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT : ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credential: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.io);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
