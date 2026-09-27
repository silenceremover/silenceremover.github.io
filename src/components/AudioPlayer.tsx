import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, FastForward } from 'lucide-react';
import { formatTime } from '../utils/audioTrimmer';

interface AudioPlayerProps {
  originalBuffer: AudioBuffer | null;
  trimmedBuffer: AudioBuffer | null;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  activeSource: 'trimmed' | 'original';
  onSourceChange: (source: 'trimmed' | 'original') => void;
  listenOriginalText: string;
  listenTrimmedText: string;
  onSeek: (time: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  originalBuffer,
  trimmedBuffer,
  currentTime,
  onTimeUpdate,
  activeSource,
  onSourceChange,
  listenOriginalText,
  listenTrimmedText,
  onSeek,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const currentBuffer = activeSource === 'trimmed' ? trimmedBuffer : originalBuffer;
  const duration = currentBuffer?.duration || 0;

  // Initialize AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Stop currently playing audio node
  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
  };

  // Start playback from specified offset
  const startPlayback = (fromSec: number) => {
    if (!currentBuffer) return;
    const ctx = getAudioContext();
    stopPlayback();

    const boundedOffset = Math.max(0, Math.min(fromSec, currentBuffer.duration));
    if (boundedOffset >= currentBuffer.duration - 0.05) {
      // Reached end, loop back to start
      offsetRef.current = 0;
    } else {
      offsetRef.current = boundedOffset;
    }

    const source = ctx.createBufferSource();
    source.buffer = currentBuffer;
    source.playbackRate.value = playbackRate;

    // Gain node for volume control
    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
    }
    gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    source.connect(gainNodeRef.current);

    startTimeRef.current = ctx.currentTime;
    source.start(0, offsetRef.current);
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
      // Check if ended naturally
      const elapsed = (ctx.currentTime - startTimeRef.current) * playbackRate;
      if (offsetRef.current + elapsed >= currentBuffer.duration - 0.1) {
        setIsPlaying(false);
        offsetRef.current = 0;
        onTimeUpdate(0);
      }
    };

    // Track real-time progress
    const updateProgress = () => {
      if (sourceNodeRef.current && ctx) {
        const elapsed = (ctx.currentTime - startTimeRef.current) * playbackRate;
        const current = offsetRef.current + elapsed;
        if (current <= currentBuffer.duration) {
          onTimeUpdate(current);
          animFrameRef.current = requestAnimationFrame(updateProgress);
        } else {
          onTimeUpdate(currentBuffer.duration);
          setIsPlaying(false);
        }
      }
    };
    animFrameRef.current = requestAnimationFrame(updateProgress);
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      const ctx = audioCtxRef.current;
      if (ctx) {
        const elapsed = (ctx.currentTime - startTimeRef.current) * playbackRate;
        offsetRef.current += elapsed;
      }
      stopPlayback();
    } else {
      startPlayback(currentTime);
    }
  };

  // Handle external seek (e.g. from waveform click)
  useEffect(() => {
    if (isPlaying) {
      startPlayback(currentTime);
    } else {
      offsetRef.current = currentTime;
    }
  }, [currentTime]);

  // When switching between Original and Trimmed
  const handleSwitchSource = (newSource: 'trimmed' | 'original') => {
    if (newSource === activeSource) return;
    const wasPlaying = isPlaying;
    stopPlayback();
    onSourceChange(newSource);
    offsetRef.current = 0;
    onTimeUpdate(0);

    if (wasPlaying) {
      setTimeout(() => startPlayback(0), 50);
    }
  };

  // Skip -5s or +5s
  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    onSeek(newTime);
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : newVol;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = nextMuted ? 0 : volume;
    }
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (sourceNodeRef.current) {
      sourceNodeRef.current.playbackRate.value = speed;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
      {/* A/B Source Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF1FF] dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => handleSwitchSource('trimmed')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSource === 'trimmed'
                ? 'bg-[#B1B2FF] text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {listenTrimmedText}
          </button>
          <button
            type="button"
            onClick={() => handleSwitchSource('original')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSource === 'original'
                ? 'bg-[#AAC4FF] text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {listenOriginalText}
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Speed:</span>
          {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => handleSpeedChange(spd)}
              className={`px-2 py-1 rounded-md text-xs font-mono transition-colors ${
                playbackRate === spd
                  ? 'bg-slate-900 text-white dark:bg-[#B1B2FF] dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Transport Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Skip Back 5s */}
          <button
            type="button"
            onClick={() => handleSkip(-5)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Big Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B1B2FF] to-[#AAC4FF] hover:opacity-95 text-slate-900 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Skip Forward 5s */}
          <button
            type="button"
            onClick={() => handleSkip(5)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Forward 5 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Time Counter */}
          <div className="ml-2 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Scrubber */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 sm:w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer appearance-none accent-[#B1B2FF]"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
};
