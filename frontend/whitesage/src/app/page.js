"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoomCreator from "../components/RoomCreator";

export default function Home() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Collaborative Whiteboard
        </h1>

        {!creating && !joining && (
          <div className="space-y-4">
            <button
              onClick={() => setCreating(true)}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create a Room
            </button>
            <button
              onClick={() => setJoining(true)}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Join a Room
            </button>
          </div>
        )}

        {creating && <RoomCreator onCancel={() => setCreating(false)} />}

        {joining && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleJoinRoom}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Join
              </button>
              <button
                onClick={() => setJoining(false)}
                className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
