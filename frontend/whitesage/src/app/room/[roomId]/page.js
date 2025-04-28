// app/room/[roomId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import Whiteboard from "../../../components/Whiteboard";
import ColorPicker from "../../../components/ColorPicker";
import { initSocket } from "../../../lib/socket";

export default function Room() {
  const params = useParams();
  const router = useRouter();
  const { roomId } = params;
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: `/room/${roomId}` },
      });
      return;
    }

    if (isAuthenticated && user) {
      const setupSocket = async () => {
        try {
          // Get access token for API authorization
          const token = await getAccessTokenSilently();

          // Initialize socket with auth token
          const newSocket = initSocket(
            roomId,
            user.name || user.email,
            user.sub,
            token
          );

          newSocket.on("connect", () => {
            setConnected(true);
            console.log("Connected to socket server");
          });

          newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            setConnected(false);
          });

          newSocket.on("roomUsers", ({ count }) => {
            setUsersCount(count);
          });

          newSocket.on("disconnect", () => {
            setConnected(false);
            console.log("Disconnected from socket server");
          });

          setSocket(newSocket);
          setLoading(false);

          return () => {
            newSocket.disconnect();
          };
        } catch (error) {
          console.error("Failed to setup socket:", error);
          setLoading(false);
        }
      };

      setupSocket();
    }
  }, [
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    user,
    roomId,
    getAccessTokenSilently,
  ]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <p className="text-center">Redirecting to login...</p>
        </div>
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
              <p className="text-xs text-gray-300">
                You: {user.name || user.email}
              </p>
            </div>
            <button
              onClick={handleCopyRoomId}
              className="py-1 px-3 bg-gray-600 rounded-md hover:bg-gray-700 text-sm"
            >
              Copy Room ID
            </button>
            <button
              onClick={handleBackToHome}
              className="py-1 px-3 bg-blue-600 rounded-md hover:bg-blue-700 text-sm"
            >
              Back to Home
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
