"use client";
import { useRef, useEffect, useState } from "react";
import BrushSlider from "@/components/brushslider";
import BrushStyle from "@/components/brushstyle";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAdjustingBrush, setIsAdjustingBrush] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [isErasing, setIsErasing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;

    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
  }, []);

  useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = brushSize;

  if (isErasing) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
  }
}, [brushSize, isErasing, color]);

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
    if (!isDrawing || isAdjustingBrush) return;
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
    <div className="flex flex-col w-full h-screen">
      {/* Option bar */}
      <div className="flex justify-end items-center w-full mt-5 px-5 gap-5 bg-white">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <img src="pencil.svg" alt="pencil" className={`h-15 hover:scale-110 transition opacity-50 ${!isErasing ? "opacity-100" : ""}`} onClick={() => setIsErasing(false)}/>
        <img src="select.svg" alt="select" className="h-15 hover:scale-110 transition opacity-50"/>
        <img src="eraser.svg" alt="eraser" className={`h-15 hover:scale-110 transition opacity-50 ${isErasing ? "opacity-100" : ""}`} onClick={() => setIsErasing(true)}/>
        <img src="layers.svg" alt="layers" className={`h-15 hover:scale-110 transition opacity-50`}/>
        <BrushStyle />
      </div>
      {/* Canvas area */}
      <div className="grid grid-cols-[56px_1fr] w-full h-screen">
        {/* Brush */}
        <div className="flex items-center justify-center z-20 pointer-events-auto bg-transparent">
          <input type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
          {/* <BrushSlider value={brushSize} 
                      onChange={(v) => setBrushSize(v)} 
                      onAdjustStart={() => setIsAdjustingBrush(true)}
                      onAdjustEnd={() => setIsAdjustingBrush(false)} /> */}
        </div>
        {/* Canva */}
        <div className="w-full h-full relative">
          <canvas
            ref ={canvasRef}
            className="bg-black w-full h-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
