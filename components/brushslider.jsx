"use client";
import { useRef, useState } from "react";

export default function BrushSlider({ value, onChange }) {
  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleMove = (clientY) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const percent = 1 - y / rect.height;

    const newValue = Math.round(percent * 100); // 0-100 brush size
    onChange(Math.max(1, newValue)); // avoid 0 size
  };

  const startDrag = (e) => {
    setDragging(true);

    if ("touches" in e) handleMove(e.touches[0].clientY);
    else handleMove(e.clientY);
  };

  const move = (e) => {
    if (!dragging) return;
    if ("touches" in e) handleMove(e.touches[0].clientY);
    else handleMove(e.clientY);
  };

  const stopDrag = () => setDragging(false);

  return (
    <div
      ref={sliderRef}
      className="h-64 w-8 bg-gray-800 rounded-full p-2 flex flex-row justify-center items-center relative touch-none select-none shadow-lg"
      onMouseDown={startDrag}
      onMouseMove={move}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchStart={startDrag}
      onTouchMove={move}
      onTouchEnd={stopDrag}
    >
      <div className="w-2 h-full bg-gray-600 rounded-full relative">
        <div
          className="absolute bg-white rounded-full shadow-md transition-transform pointer-events-none"
          style={{ width: `20px`, height: `20px`, left: "50%", transform: `translateX(-50%) translateY(${(1 - value / 100) * 100}%)`,}}
        />
      </div>
    </div>
  );
}
