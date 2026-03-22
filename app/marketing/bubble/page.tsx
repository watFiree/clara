"use client";

import { useRef, useState } from "react";
import { BrandBubble } from "@/components/brand-logo";

export default function MarketingBubblePage() {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(512);

  const handleDownload = async () => {
    if (!bubbleRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the bubble using canvas API to match the CSS gradient
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    // Main radial gradient (offset center at 35% 30%)
    const mainGrad = ctx.createRadialGradient(
      size * 0.35, size * 0.3, 0,
      cx, cy, r
    );
    mainGrad.addColorStop(0, "#ffe0a0");
    mainGrad.addColorStop(0.4, "#ffbc47");
    mainGrad.addColorStop(0.75, "#e8920a");
    mainGrad.addColorStop(1, "#c06a00");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = mainGrad;
    ctx.fill();

    // Highlight ellipse
    ctx.save();
    const hx = size * 0.2 + (size * 0.45) / 2;
    const hy = size * 0.15 + (size * 0.35) / 2;
    const hrx = (size * 0.45) / 2;
    const hry = (size * 0.35) / 2;

    const highlightGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(hrx, hry));
    highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    highlightGrad.addColorStop(0.7, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.ellipse(hx, hy, hrx, hry, 0, 0, Math.PI * 2);
    ctx.fillStyle = highlightGrad;
    ctx.fill();
    ctx.restore();

    const link = document.createElement("a");
    link.download = `clara-bubble-${size}x${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-background">
      <div ref={bubbleRef}>
        <BrandBubble className="h-64 w-64" />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 rounded-md border bg-background px-3 py-2 text-center text-sm"
          min={1}
        />
        <span className="text-sm text-muted-foreground">px</span>
        <button
          onClick={handleDownload}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
