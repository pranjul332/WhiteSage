"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomCreator({ onCancel }) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    if (!userName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorName: userName }),
      });

      const data = await response.json();
      if (data.roomId) {
        localStorage.setItem("userName", userName);
        router.push(`/room/${data.roomId}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />
      <div className="flex space-x-2">
        <button
          onClick={createRoom}
          disabled={loading}
          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
