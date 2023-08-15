// server.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Use the cors middleware
app.use(cors());

// API
app.get("/", (req, res) => {
  res.send("API is running.");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for a custom event to associate a client with a name
  socket.on("join", (username) => {
    // Join a room based on the username
    socket.join(username);
    console.log(`${username} joined the room`);

    // Emit a welcome message to the joined client
    io.to(username).emit("message", `Welcome, ${username}!`);
  });

  // Listen for changes and emit to the specific client
  socket.on("update", (username, data) => {
    console.log(`Received update from ${username}:`, data);
    io.to(username).emit("update", data); // Emit to the specific client
  });

  // disconnect console log wiht username
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const username = socket.rooms.keys().next().value;
    console.log(username);

    // Emit a message to all clients when a user disconnects
    io.emit("message", `${username} disconnected`);
  });
});

const PORT_API = 6000;
const PORT_SOCKET = 4000;

server.listen(PORT_API, () => {
  console.log(`API server is running on port ${PORT_API}`);
});

io.listen(PORT_SOCKET, () => {
  console.log(`Socket.IO server is running on port ${PORT_SOCKET}`);
});
