// frontend/components/Whiteboard.js - FIXED VERSION
"use client";

import { useRef, useEffect, useState } from "react";

export default function Whiteboard({ socket, color, lineWidth }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    setContext(ctx);

    const handleResize = () => {
      setCanvasWidth(canvas.parentElement.clientWidth);
      setCanvasHeight(canvas.parentElement.clientHeight);
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Handle drawing from other users
    socket.on("draw", (data) => {
      if (!ctx) return;
      drawLine(
        ctx,
        data.x0,
        data.y0,
        data.x1,
        data.y1,
        data.color,
        data.lineWidth
      );
    });

    socket.on("clear", () => {
      clearCanvas();
    });

    socket.on("currentCanvas", (imageData) => {
      if (!imageData) return;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
    });

    // When joining a room, request the current canvas state
    socket.emit("requestCanvasData");

    // Every 30 seconds, save canvas data to server for new joiners
    const saveInterval = setInterval(() => {
      if (canvas) {
        const imageData = canvas.toDataURL("image/png");
        socket.emit("saveCanvas", imageData);
      }
    }, 30000);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.off("draw");
      socket.off("clear");
      socket.off("currentCanvas");
      clearInterval(saveInterval);
    };
  }, [socket]);

  const startDrawing = (e) => {
    const coords = getCoordinates(e);
    lastPos.current = coords;
    setIsDrawing(true);
  };

  const drawLine = (ctx, x0, y0, x1, y1, color, width) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      // Save canvas state after drawing ends
      const imageData = canvasRef.current.toDataURL("image/png");
      socket.emit("saveCanvas", imageData);
    }
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    if (e.touches && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    };
  };

  const drawMove = (e) => {
    if (!isDrawing || !context) return;

    const { offsetX, offsetY } = getCoordinates(e);
    const x0 = lastPos.current.offsetX;
    const y0 = lastPos.current.offsetY;

    // Draw on my canvas
    drawLine(context, x0, y0, offsetX, offsetY, color, lineWidth);

    // Send to other users
    socket.emit("draw", {
      x0,
      y0,
      x1: offsetX,
      y1: offsetY,
      color,
      lineWidth,
    });

    // Update last position
    lastPos.current = { offsetX, offsetY };
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const handleClear = () => {
    clearCanvas();
    socket.emit("clear");
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = image;
      link.click();
    }
  };

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={startDrawing}
        onMouseMove={drawMove}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={drawMove}
        onTouchEnd={stopDrawing}
        className="border border-gray-300 bg-white"
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={handleClear}
          className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
