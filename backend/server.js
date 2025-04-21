const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const roomsManager = require("./rooms");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors());
app.use(express.json());

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// API Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/rooms", roomRoutes);


// Socket.io connection handling
io.on("connection", (socket) => {
  const { roomId, userName } = socket.handshake.query;

  console.log(`User ${userName} connected to room ${roomId}`);

  // Create room if it doesn't exist
  if (!roomsManager.roomExists(roomId)) {
    roomsManager.createRoom(roomId, userName);
  }

  // Join the socket to the room
  socket.join(roomId);
  roomsManager.addUserToRoom(roomId, socket.id, userName);

  // Send current canvas state to the new user
  const canvasData = roomsManager.getCanvasData(roomId);
  if (canvasData) {
    socket.emit("currentCanvas", canvasData);
  }

  // Broadcast updated user count
  io.to(roomId).emit("roomUsers", {
    count: roomsManager.getUserCount(roomId),
  });

  // Handle drawing events
   socket.on("requestCanvasData", () => {
     const canvasData = roomsManager.getCanvasData(roomId);
     if (canvasData) {
       socket.emit("currentCanvas", canvasData);
     }
   });

   // Update the draw event handler to be more performant
   socket.on("draw", (data) => {
     // Broadcast to everyone in the room except the sender
     socket.to(roomId).emit("draw", data);
   });

  // Handle canvas clear events
  socket.on("clear", () => {
    roomsManager.clearCanvas(roomId);
    socket.to(roomId).emit("clear");
  });

  // Handle canvas state save
  socket.on("saveCanvas", (imageData) => {
    roomsManager.saveCanvasData(roomId, imageData);
    console.log(`Canvas data saved for room ${roomId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${userName} disconnected from room ${roomId}`);
    roomsManager.removeUserFromRoom(roomId, socket.id);

    // Broadcast updated user count
    io.to(roomId).emit("roomUsers", {
      count: roomsManager.getUserCount(roomId),
    });

    // Remove room if empty
    if (roomsManager.getUserCount(roomId) === 0) {
      roomsManager.removeRoom(roomId);
      console.log(`Room ${roomId} removed due to inactivity`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
