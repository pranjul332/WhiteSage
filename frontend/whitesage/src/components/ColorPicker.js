"use client";

import { useState } from "react";

export default function ColorPicker({
  color,
  setColor,
  lineWidth,
  setLineWidth,
}) {
  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFFFFF", // White
  ];

  const lineWidths = [2, 5, 10, 15, 20];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {colors.map((c) => (
          <button
            key={c}
            className={`w-12 h-12 rounded-full border-2 ${
              color === c ? "border-gray-800" : "border-gray-300"
            }`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>

      <div className="border-t border-gray-300 pt-4 flex flex-col gap-2">
        {lineWidths.map((width) => (
          <button
            key={width}
            className={`w-12 h-8 flex items-center justify-center rounded-md ${
              lineWidth === width ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setLineWidth(width)}
          >
            <div
              className="rounded-full bg-black"
              style={{ width: width, height: width }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
