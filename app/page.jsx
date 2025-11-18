"use client";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  // Drawing tools
  const [pencil, setPencil] = useState(true);
  const [isErasing, setIsErasing] = useState(false);
  const [circle, setCircle] = useState(false);
  const [rectangle, setRectangle] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  // Drawing modes
  const [isDrawing, setIsDrawing] = useState(false);
  const [initialPos, setInitialPos] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  // Configuration of brush
  const [color, setColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(20);
  const [reset, resetCanvas] = useState(false);
  // Resizing tools
  const [selectionArea, setSelectionArea] = useState(null);
  const [selectionImage, setSelectionImage] = useState(null);
  const [selectionBackground, setSelectionBackground] = useState(null);
  const [creatingSelection, setCreatingSelection] = useState(false);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastMouse, setLastMouse] = useState(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
  }, [reset]);

  useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = brushSize;

  if (isErasing) {
    ctx.globalCompositeOperation = "destination-out";
  } 
  else if (isDrawing) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
  }
  else if (circle) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
  }
  else if (rectangle) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
  }
  else if (isSelecting) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 5;
  }
}, [brushSize, isErasing, color, circle, rectangle, isSelecting, isDrawing]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (selectionImage && selectionArea) {
      const { x: sx, y: sy, width, height } = selectionArea;
      const inside = x >= sx && x <= sx + width && y >= sy && y <= sy + height;
      if (inside && !creatingSelection) {
        setDragOffset({ x: x - sx, y: y - sy });
        if (selectionBackground) {
          setTempImage(selectionBackground);
        } else {
          setTempImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
        setIsDraggingSelection(true);
        setIsDrawing(true);
        return;
      }
    }

    if (pencil || isErasing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setInitialPos({ x, y });
      setTempImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setIsDrawing(true);
    } else if (isSelecting) {
      setCreatingSelection(true);
      setInitialPos({ x, y });
      setTempImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setIsDrawing(true);
    } else {
      setInitialPos({ x, y });
      setTempImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if ((circle || rectangle) && (!tempImage || !initialPos)) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;


    if (isDraggingSelection && selectionImage && (tempImage || selectionBackground)) {
      if (selectionBackground) ctx.putImageData(selectionBackground, 0, 0);
      else ctx.putImageData(tempImage, 0, 0);

      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;

      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      setSelectionArea((prev) => ({ ...(prev || {}), x: newX, y: newY }));

      ctx.putImageData(selectionImage, newX, newY);

      setLastMouse({ x: mouseX, y: mouseY });
      return;
    }

    if (pencil || isErasing) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }else{
      if (!tempImage) return;
      ctx.putImageData(tempImage, 0, 0);

      const dx = x - initialPos.x;
      const dy = y - initialPos.y;

      if (isSelecting){
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(initialPos.x, initialPos.y, dx, dy);
        ctx.stroke();
        setLastMouse({ x, y });
      }else{
        ctx.beginPath();
  
        if (rectangle) {
          ctx.rect(initialPos.x, initialPos.y, dx, dy);
        }
  
        if (circle) {
          const radius = Math.sqrt(dx * dx + dy * dy);
          ctx.arc(initialPos.x, initialPos.y, radius, 0, Math.PI * 2);
        }
  
        ctx.stroke();
      }
    }
    setLastMouse({ x, y });

  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.setLineDash([]);

    if (creatingSelection) {
      if (initialPos && lastMouse) {
        const x = Math.min(initialPos.x, lastMouse.x);
        const y = Math.min(initialPos.y, lastMouse.y);
        const width = Math.abs(lastMouse.x - initialPos.x);
        const height = Math.abs(lastMouse.y - initialPos.y);

        if (width > 0 && height > 0) {
          const img = ctx.getImageData(x, y, width, height);

            if (tempImage) ctx.putImageData(tempImage, 0, 0);
            ctx.clearRect(x, y, width, height);

            const bg = ctx.getImageData(0, 0, canvas.width, canvas.height);

            ctx.putImageData(img, x, y);

            setSelectionArea({ x, y, width, height });
            setSelectionImage(img);
            setSelectionBackground(bg);
        }
      }
      setCreatingSelection(false);
    }

    if (isDraggingSelection && (selectionBackground || tempImage) && selectionArea && selectionImage) {
      if (selectionBackground) ctx.putImageData(selectionBackground, 0, 0);
      else ctx.putImageData(tempImage, 0, 0);

      ctx.putImageData(selectionImage, selectionArea.x, selectionArea.y);

      setIsDraggingSelection(false);
      setSelectionImage(null);
      setSelectionArea(null);
      setSelectionBackground(null);
      setIsSelecting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Option bar */}
      <div className="flex justify-end items-center w-full mt-5 px-5 gap-5 bg-white">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <img src="pencil.svg" alt="pencil" className={`h-15 hover:scale-110 transition opacity-50 ${pencil ? "opacity-100" : ""}`} onClick={() => { setPencil(true); setIsErasing(false); setCircle(false); setRectangle(false); setIsSelecting(false); }} />
        <img src="circle.svg" alt="circle" className={`h-15 hover:scale-110 transition opacity-50 ${circle ? "opacity-100" : ""}`} onClick={() => { setCircle(true); setRectangle(false); setPencil(false); setIsErasing(false); setIsSelecting(false); }} />
        <img src="rectangle.svg" alt="select" className={`h-15 hover:scale-110 transition opacity-50 ${rectangle ? "opacity-100" : ""}`} onClick={() => { setRectangle(true); setCircle(false); setPencil(false); setIsErasing(false); setIsSelecting(false); }} />
        <img src="eraser.svg" alt="eraser" className={`h-15 hover:scale-110 transition opacity-50 ${isErasing ? "opacity-100" : ""}`} onClick={() => { setIsErasing(true); setPencil(false); setCircle(false); setRectangle(false); setIsSelecting(false); }} />
        <img src="select.svg" alt="layers" className={`h-15 hover:scale-110 transition opacity-50 ${isSelecting ? "opacity-100" : ""}`} onClick={() => { setIsSelecting(true); setIsErasing(false); setPencil(false); setCircle(false); setRectangle(false); }} />
        <img src="reset.svg" alt="reset" className="h-15 hover:scale-110 transition opacity-50" onClick={() => { resetCanvas(prev => !prev) }} />
      </div>
      {/* Canvas area */}
      <div className="grid grid-cols-[56px_1fr] w-full h-screen">
        {/* Brush size */}
        <div className="flex items-center justify-center z-20 pointer-events-auto bg-transparent">
          <input className="brush-slider" type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))}/>
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
