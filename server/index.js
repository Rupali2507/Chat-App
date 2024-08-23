const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/MsgRoutes");

const socket = require("socket.io");

// const { connectToMongoDB } = require("./connection");

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

const uri = process.env.MONGO_URL; // Ensure this matches your environment variable
if (!uri) {
  throw new Error("MongoDB URI is not defined in the environment variables.");
}
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
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
