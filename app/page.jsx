"use client";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <>
      <div className="grid grid-rows-[80px_auto] w-full h-screen">
        {/* Option bar */}
        <div className="flex justify-end items-center w-full mt-5 px-5 gap-5 bg-white">
          <img src="pencil.svg" alt="pencil" className="h-15 hover:scale-110 transition"/>
          <img src="select.svg" alt="select" className="h-15 hover:scale-110 transition"/>
          <img src="eraser.svg" alt="eraser" className="h-15 hover:scale-110 transition"/>
          <img src="layers.svg" alt="layers" className="h-15 hover:scale-110 transition"/>
        </div>
        <canvas
          ref ={canvasRef}
          className="border-2 border-black bg-black"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </>
  );
}
