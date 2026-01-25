"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './PredictionCanvas.module.css';

interface Point {
  t: number;      // timestamp
  x: number;      // x pixel coordinate
  y: number;      // y pixel coordinate
  price: number;  // mapped price value
  v: number;      // velocity (pixels/ms)
  a: number;      // acceleration (pixels/ms^2)
}

interface PredictionCanvasProps {
  width?: number;
  height?: number;
  minPrice?: number;
  maxPrice?: number;
  startPoint: { x: number, y: number, price: number };
  onPathComplete?: (path: Point[]) => void;
  onSubmit?: () => void;
}

export default function PredictionCanvas({
  width = 800,
  height = 600,
  minPrice = 20000,
  maxPrice = 30000,
  startPoint,
  onPathComplete,
  onSubmit
}: PredictionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Use a Ref to store points to avoid re-renders during high-frequency drawing
  const pathRef = useRef<Point[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Helper to map Y pixel to Price
  const getPrice = (y: number, rectHeight: number) => {
    // Invert Y because pixel 0 is top, but price max is top
    const normalized = 1 - (y / rectHeight);
    return minPrice + normalized * (maxPrice - minPrice);
  };

  // Helper to get Y pixel from Price
  // This helper is no longer used directly in startDrawing due to startPoint prop
  // const getY = (price: number, rectHeight: number) => {
  //   const normalized = (price - minPrice) / (maxPrice - minPrice);
  //   return (1 - normalized) * rectHeight;
  // };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || hasDrawn) return; // Only allow one path? or allow redraw if we verify. For now, reset on start.

    setIsDrawing(true);
    setHasDrawn(false);
    pathRef.current = []; // Reset path

    // Strict Start!
    const x = startPoint.x;
    const y = startPoint.y;
    const t = Date.now();

    pathRef.current.push({
      t,
      x,
      y,
      price: startPoint.price,
      v: 0,
      a: 0
    });

    lastTimeRef.current = t;

    // Clear and start path in visual
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = '#ffffff'; // White
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#ffffff'; // White Glow
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // STRICT CONSTRAINTS
    // 1. Must be to the right of start point (and previous point)
    const prevPoint = pathRef.current[pathRef.current.length - 1];

    // To avoid jitter, ensure moved at least a bit
    if (x <= prevPoint.x) return;

    // Logic: If user moves mouse continuously, we record.
    // If they go backwards, we ignore or stop? Ignore is better for "drawing forward".

    const t = Date.now();
    const dt = t - lastTimeRef.current;

    const dx = x - prevPoint.x;
    const dy = y - prevPoint.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const v = dt > 0 ? dist / dt : 0;
    const dv = v - prevPoint.v;
    const a = dt > 0 ? dv / dt : 0;

    pathRef.current.push({
      t,
      x,
      y,
      price: getPrice(y, rect.height),
      v,
      a
    });

    lastTimeRef.current = t;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const isValidPrediction = () => {
    if (pathRef.current.length < 2) return false;
    const lastPoint = pathRef.current[pathRef.current.length - 1];
    return (lastPoint.x - startPoint.x) > 100; // Require at least 100px width (~20 candles aprox depending on zoom)
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Only set as "Drawn" if it's long enough
    if (isValidPrediction()) {
      setHasDrawn(true);
      if (onPathComplete) onPathComplete(pathRef.current);
    } else {
      // Auto-reset if too short
      pathRef.current = [];
      const canvas = canvasRef.current;
      if (canvas && canvas.getContext('2d')) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const resetDrawing = () => {
    setHasDrawn(false);
    setIsDrawing(false);
    pathRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Resize canvas to match display size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Visual cues for startPoint
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !isDrawing && !hasDrawn) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw faint "Drawing Area" bg (right of x)
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(startPoint.x, 0, canvas.width - startPoint.x, canvas.height);

        // Draw a dashed vertical line
        ctx.beginPath();
        ctx.moveTo(startPoint.x, 0);
        ctx.lineTo(startPoint.x, canvas.height);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw a pulsating dot
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Draw explicit text "Start Here"
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#888';
        ctx.fillText('START PREDICTION', startPoint.x + 8, startPoint.y + 3);
      }
    }
  }, [startPoint, isDrawing, hasDrawn]);

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: '0', // Square
    fontWeight: '600', // Sligthly bolder for clean look
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit', // Use the global Gothic font
    transition: 'all 0.2s',
    marginLeft: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Submit Action */}
      {hasDrawn && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          zIndex: 30,
          display: 'flex'
        }}>
          <button
            onClick={resetDrawing}
            style={{ ...buttonStyle, borderColor: '#555', color: '#888' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff', e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#555', e.currentTarget.style.color = '#888')}
          >
            REDRAW
          </button>

          <button
            onClick={onSubmit}
            style={{ ...buttonStyle, background: '#fff', color: '#000', borderColor: '#fff' }}
          >
            SUBMIT PREDICTION
          </button>
        </div>
      )}
    </div>
  );
}
