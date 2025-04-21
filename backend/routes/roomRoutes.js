const express = require("express");
const router = express.Router();
const roomsManager = require("../rooms");
const { v4: uuidv4 } = require("uuid");


router.post("/create", (req, res) => {
  const { creatorName } = req.body;

  if (!creatorName) {
    return res.status(400).json({ error: "Creator name is required" });
  }

  const roomId = uuidv4().substring(0, 8); // Generate a shorter room ID

  roomsManager.createRoom(roomId, creatorName);

  res.status(201).json({ roomId });
});

router.get("/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = roomsManager.getRoom(roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.status(200).json({ room });
});

module.exports = router;
