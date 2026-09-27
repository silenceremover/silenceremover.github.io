import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { AudioSegment } from '../utils/audioTrimmer';
import { formatTime } from '../utils/audioTrimmer';

interface AudioWaveformProps {
  buffer: AudioBuffer | null;
  activeSegments: AudioSegment[];
  silentSegments: AudioSegment[];
  currentTime: number;
  duration: number;
  onSeek: (timeSec: number) => void;
  legendAudible: string;
  legendSilent: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  buffer,
  activeSegments,
  silentSegments,
  currentTime,
  duration,
  onSeek,
  legendAudible,
  legendSilent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Peak extraction cache
  const peaksRef = useRef<{ min: Float32Array; max: Float32Array; barsCount: number } | null>(null);

  // Compute peaks when buffer changes
  useEffect(() => {
    if (!buffer) {
      peaksRef.current = null;
      return;
    }

    const channelData = buffer.getChannelData(0);
    const barsCount = 800; // Resolution of waveform
    const step = Math.floor(channelData.length / barsCount);
    const minPeaks = new Float32Array(barsCount);
    const maxPeaks = new Float32Array(barsCount);

    for (let i = 0; i < barsCount; i++) {
      let min = 1.0;
      let max = -1.0;
      const start = i * step;
      const end = Math.min(start + step, channelData.length);

      for (let j = start; j < end; j += 4) {
        const val = channelData[j];
        if (val < min) min = val;
        if (val > max) max = val;
      }

      minPeaks[i] = min === 1.0 ? 0 : min;
      maxPeaks[i] = max === -1.0 ? 0 : max;
    }

    peaksRef.current = { min: minPeaks, max: maxPeaks, barsCount };
  }, [buffer]);

  // Render canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer || !peaksRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    // Adjust canvas resolution for Retina / high-DPI displays
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.classList.contains('dark');
    const midY = height / 2;

    // Background color
    ctx.fillStyle = isDark ? '#1E293B' : '#F1F5F9';
    ctx.fillRect(0, 0, width, height);

    const totalDur = buffer.duration || 1;

    // 1. Draw silent cut regions (translucent red / striped)
    for (const silence of silentSegments) {
      const startX = (silence.startSec / totalDur) * width;
      const endX = (silence.endSec / totalDur) * width;
      const regionWidth = Math.max(1.5, endX - startX);

      // Background highlight for cut silence
      ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.22)' : 'rgba(244, 63, 94, 0.16)';
      ctx.fillRect(startX, 0, regionWidth, height);

      // Cut boundary line
      ctx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.5)' : 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, height);
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX, height);
      ctx.stroke();
    }

    // 2. Draw audio waveform bars
    const { min, max, barsCount } = peaksRef.current;
    const barWidth = width / barsCount;

    for (let i = 0; i < barsCount; i++) {
      const x = i * barWidth;
      const timeAtBar = (i / barsCount) * totalDur;

      // Check if this bar falls inside a silent region
      const isSilent = silentSegments.some(
        s => timeAtBar >= s.startSec && timeAtBar <= s.endSec
      );

      const topY = midY - max[i] * (midY - 4);
      const bottomY = midY - min[i] * (midY - 4);
      const barHeight = Math.max(2, bottomY - topY);

      if (isSilent) {
        ctx.fillStyle = isDark ? 'rgba(248, 113, 113, 0.55)' : 'rgba(239, 68, 68, 0.65)';
      } else {
        // Active audio: Theme pastel accent (#B1B2FF / #AAC4FF)
        ctx.fillStyle = isDark ? '#AAC4FF' : '#6366F1';
      }

      ctx.fillRect(x, topY, Math.max(1, barWidth - 0.5), barHeight);
    }

    // 3. Center line
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // 4. Playhead
    if (currentTime >= 0 && currentTime <= totalDur) {
      const playheadX = (currentTime / totalDur) * width;

      // Glow behind playhead
      ctx.shadowColor = '#B1B2FF';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#B1B2FF';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      // Playhead top marker
      ctx.fillStyle = '#B1B2FF';
      ctx.beginPath();
      ctx.arc(playheadX, 6, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    // 5. Hover indicator
    if (hoverX !== null && hoverX >= 0 && hoverX <= width) {
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [buffer, silentSegments, currentTime, hoverX]);

  // Request animation frame for smooth rendering
  useEffect(() => {
    let animId: number;
    const render = () => {
      draw();
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Seek handling
  const handleSeekFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const targetTime = (x / rect.width) * duration;
    onSeek(targetTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleSeekFromEvent(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverX(x);
    setHoverTime((x / rect.width) * duration);

    if (isDragging) {
      handleSeekFromEvent(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverX(null);
    setHoverTime(null);
  };

  return (
    <div className="w-full flex flex-col gap-2" ref={containerRef}>
      {/* Waveform Canvas with interactive scrub */}
      <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden border border-[#D2DAFF] dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-inner select-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />

        {/* Hover Time Tooltip */}
        {hoverTime !== null && hoverX !== null && (
          <div
            className="absolute top-2 pointer-events-none transform -translate-x-1/2 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/90 text-white shadow-md border border-slate-700"
            style={{ left: `${hoverX}px` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Current Time Badge */}
        <div className="absolute bottom-2 left-2 pointer-events-none px-2 py-1 rounded-md text-xs font-mono font-medium bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B1B2FF] animate-pulse"></span>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>

      {/* Waveform Legend & Hints */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#6366F1] dark:bg-[#AAC4FF]"></span>
            <span>{legendAudible}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500/80"></span>
            <span>{legendSilent}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          Click or drag across the waveform to scrub
        </div>
      </div>
    </div>
  );
};
