// components/RoomCreator.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function RoomCreator({ onCancel }) {
  const router = useRouter();
  const { getAccessTokenSilently ,user } = useAuth0();
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      // Get the access token
      const token = await getAccessTokenSilently();

      // Create the room via API
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/rooms`,
        {
          name: roomName,
          creatorName: user?.name || "Anonymous",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Navigate to the new room
      router.push(`/room/${response.data.roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      setError("Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
        disabled={isCreating}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-2">
        <button
          onClick={handleCreateRoom}
          disabled={isCreating}
          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isCreating ? "Creating..." : "Create"}
        </button>
        <button
          onClick={onCancel}
          disabled={isCreating}
          className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
