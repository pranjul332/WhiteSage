"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Whiteboard from "../../../components/Whiteboard";
import ColorPicker from "../../../components/ColorPicker";
import { initSocket } from "../../../lib/socket";

export default function Room() {
  const params = useParams();
  const { roomId } = params;

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);

  useEffect(() => {
    // Get user name from localStorage or prompt
    const storedUserName = localStorage.getItem("userName");
    const userNameToUse =
      storedUserName || prompt("Enter your name to join the room:");

    if (userNameToUse) {
      setUserName(userNameToUse);
      if (!storedUserName) {
        localStorage.setItem("userName", userNameToUse);
      }

      // Initialize socket connection
      const newSocket = initSocket(roomId, userNameToUse);

      newSocket.on("connect", () => {
        setConnected(true);
        console.log("Connected to socket server");
      });

      newSocket.on("roomUsers", ({ count }) => {
        setUsersCount(count);
      });

      newSocket.on("disconnect", () => {
        setConnected(false);
        console.log("Disconnected from socket server");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
  };

  if (!userName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Collaborative Whiteboard</h1>
            <p className="text-sm text-gray-300">Room: {roomId}</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-green-400 text-sm">
                {usersCount} users online
              </span>
              <p className="text-xs text-gray-300">You: {userName}</p>
            </div>
            <button
              onClick={handleCopyRoomId}
              className="py-1 px-3 bg-gray-600 rounded-md hover:bg-gray-700 text-sm"
            >
              Copy Room ID
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="w-16 bg-gray-200 p-2">
          <ColorPicker
            color={color}
            setColor={setColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
          />
        </div>
        <div className="flex-1 bg-gray-100">
          {socket && connected ? (
            <Whiteboard socket={socket} color={color} lineWidth={lineWidth} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Connecting...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
