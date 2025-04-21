

const rooms = new Map();

// Create a new room
function createRoom(roomId, creatorName) {
  rooms.set(roomId, {
    id: roomId,
    createdAt: new Date(),
    createdBy: creatorName,
    users: new Map(),
    canvasData: null,
  });

  console.log(`Room ${roomId} created by ${creatorName}`);
  return roomId;
}

// Check if a room exists
function roomExists(roomId) {
  return rooms.has(roomId);
}

// Get room details
function getRoom(roomId) {
  if (!rooms.has(roomId)) return null;

  const room = rooms.get(roomId);
  return {
    id: room.id,
    createdAt: room.createdAt,
    createdBy: room.createdBy,
    userCount: room.users.size,
  };
}

// Add a user to a room
function addUserToRoom(roomId, socketId, userName) {
  if (!rooms.has(roomId)) return false;

  rooms.get(roomId).users.set(socketId, {
    name: userName,
    joinedAt: new Date(),
  });

  return true;
}

// Remove a user from a room
function removeUserFromRoom(roomId, socketId) {
  if (!rooms.has(roomId)) return false;

  return rooms.get(roomId).users.delete(socketId);
}

// Get the number of users in a room
function getUserCount(roomId) {
  if (!rooms.has(roomId)) return 0;

  return rooms.get(roomId).users.size;
}

// Save canvas data for a room
function saveCanvasData(roomId, canvasData) {
  if (!rooms.has(roomId)) return false;

  rooms.get(roomId).canvasData = canvasData;
  return true;
}

// Get canvas data for a room
function getCanvasData(roomId) {
  if (!rooms.has(roomId)) return null;

  return rooms.get(roomId).canvasData;
}

// Clear canvas data for a room
function clearCanvas(roomId) {
  if (!rooms.has(roomId)) return false;

  rooms.get(roomId).canvasData = null;
  return true;
}

// Remove a room
function removeRoom(roomId) {
  return rooms.delete(roomId);
}

module.exports = {
  createRoom,
  roomExists,
  getRoom,
  addUserToRoom,
  removeUserFromRoom,
  getUserCount,
  saveCanvasData,
  getCanvasData,
  clearCanvas,
  removeRoom,
};
