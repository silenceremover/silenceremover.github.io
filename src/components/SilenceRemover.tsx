import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Sparkles, 
  Download, 
  Scissors, 
  Clock, 
  Percent, 
  Sliders, 
  FileAudio, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  FileDown
} from 'lucide-react';
import type { TranslationSchema } from '../i18n/translations';
import { 
  detectAudioSegments, 
  renderTrimmedAudioBuffer, 
  audioBufferToWavBlob, 
  audioBufferToMp3Blob,
  createDemoAudioBuffer,
  formatTime,
  type AudioSegment,
  type TrimmingStats 
} from '../utils/audioTrimmer';
import { AudioWaveform } from './AudioWaveform';
import { AudioPlayer } from './AudioPlayer';

interface SilenceRemoverProps {
  t: TranslationSchema['tool'];
}

type PresetKey = 'podcast' | 'audiobook' | 'aggressive' | 'gentle';

const PRESET_VALUES: Record<PresetKey, { thresholdDb: number; minSilenceMs: number; paddingMs: number }> = {
  podcast: { thresholdDb: -36, minSilenceMs: 300, paddingMs: 40 },
  audiobook: { thresholdDb: -40, minSilenceMs: 450, paddingMs: 60 },
  aggressive: { thresholdDb: -30, minSilenceMs: 200, paddingMs: 25 },
  gentle: { thresholdDb: -45, minSilenceMs: 500, paddingMs: 80 },
};

export const SilenceRemover: React.FC<SilenceRemoverProps> = ({ t }) => {
  // File state
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEncodingMp3, setIsEncodingMp3] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Buffers
  const [originalBuffer, setOriginalBuffer] = useState<AudioBuffer | null>(null);
  const [trimmedBuffer, setTrimmedBuffer] = useState<AudioBuffer | null>(null);
  const [activeSegments, setActiveSegments] = useState<AudioSegment[]>([]);
  const [silentSegments, setSilentSegments] = useState<AudioSegment[]>([]);
  const [stats, setStats] = useState<TrimmingStats | null>(null);

  // Parameters
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('podcast');
  const [thresholdDb, setThresholdDb] = useState<number>(PRESET_VALUES.podcast.thresholdDb);
  const [minSilenceMs, setMinSilenceMs] = useState<number>(PRESET_VALUES.podcast.minSilenceMs);
  const [paddingMs, setPaddingMs] = useState<number>(PRESET_VALUES.podcast.paddingMs);

  // Player state
  const [activeSource, setActiveSource] = useState<'trimmed' | 'original'>('trimmed');
  const [currentTime, setCurrentTime] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

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

  // Preset switch
  const handleApplyPreset = (key: PresetKey) => {
    setSelectedPreset(key);
    const p = PRESET_VALUES[key];
    setThresholdDb(p.thresholdDb);
    setMinSilenceMs(p.minSilenceMs);
    setPaddingMs(p.paddingMs);
  };

  // Decode file
  const decodeAndProcessFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

      const arrayBuffer = await file.arrayBuffer();
      const ctx = getAudioContext();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
      setOriginalBuffer(decodedBuffer);

      // Process silence removal
      processAudioBuffer(decodedBuffer, thresholdDb, minSilenceMs, paddingMs);
    } catch (err: unknown) {
      console.error('Audio decode error:', err);
      setErrorMessage('Could not decode this audio file. Please ensure it is a valid MP3, WAV, M4A, or AAC file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Demo Audio
  const handleLoadDemo = () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const ctx = getAudioContext();
      const demoBuf = createDemoAudioBuffer(ctx);
      setFileName('demo-speech-with-pauses.wav');
      setFileSize('1.4 MB');
      setOriginalBuffer(demoBuf);
      processAudioBuffer(demoBuf, thresholdDb, minSilenceMs, paddingMs);
    } catch (err) {
      console.error('Demo error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process or re-process buffer
  const processAudioBuffer = (
    buf: AudioBuffer,
    threshold: number,
    minSilence: number,
    padding: number
  ) => {
    const ctx = getAudioContext();
    const { activeSegments: active, silentSegments: silent } = detectAudioSegments(buf, {
      thresholdDb: threshold,
      minSilenceDurationMs: minSilence,
      paddingMs: padding,
    });

    const rendered = renderTrimmedAudioBuffer(ctx, buf, active);
    const origDur = buf.duration;
    const trimDur = rendered.duration;
    const savedSec = Math.max(0, origDur - trimDur);
    const savedPct = origDur > 0 ? (savedSec / origDur) * 100 : 0;

    setActiveSegments(active);
    setSilentSegments(silent);
    setTrimmedBuffer(rendered);
    setStats({
      originalDurationSec: origDur,
      trimmedDurationSec: trimDur,
      savedSeconds: savedSec,
      savedPercentage: savedPct,
      cutCount: silent.length,
    });
    setCurrentTime(0);
    setActiveSource('trimmed');
  };

  // Re-run processing when settings change if buffer already exists
  const handleReProcess = () => {
    if (!originalBuffer) return;
    setIsProcessing(true);
    setTimeout(() => {
      processAudioBuffer(originalBuffer, thresholdDb, minSilenceMs, paddingMs);
      setIsProcessing(false);
    }, 10);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      decodeAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      decodeAndProcessFile(e.target.files[0]);
    }
  };

  // Download Lossless Studio WAV
  const handleDownloadWav = () => {
    if (!trimmedBuffer) return;
    const blob = audioBufferToWavBlob(trimmedBuffer);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'audio';
    a.href = url;
    a.download = `${baseName}_silence_removed.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download MP3
  const handleDownloadMp3 = async () => {
    if (!trimmedBuffer) return;
    try {
      setIsEncodingMp3(true);
      const blob = await audioBufferToMp3Blob(trimmedBuffer, 192);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'audio';
      a.href = url;
      a.download = `${baseName}_silence_removed.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('MP3 encoding error:', err);
      // Fallback to WAV if MP3 encoder issues
      handleDownloadWav();
    } finally {
      setIsEncodingMp3(false);
    }
  };

  // Reset
  const handleReset = () => {
    setOriginalBuffer(null);
    setTrimmedBuffer(null);
    setFileName(null);
    setFileSize(null);
    setStats(null);
    setActiveSegments([]);
    setSilentSegments([]);
    setCurrentTime(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.webm"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Upload Drop Zone if no file loaded */}
      {!originalBuffer ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 group ${
            isDragging
              ? 'border-[#B1B2FF] bg-[#D2DAFF]/30 dark:bg-slate-800/80 scale-[1.01]'
              : 'border-[#AAC4FF] dark:border-slate-700 bg-white/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-[#B1B2FF] shadow-xs'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B1B2FF] to-[#AAC4FF] text-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#EEF1FF]">
                {t.dropTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t.dropSubtitle}
              </p>
            </div>

            {/* Quick Demo Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadDemo();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#EEF1FF] dark:bg-slate-700 hover:bg-[#D2DAFF] dark:hover:bg-slate-600 text-slate-800 dark:text-[#EEF1FF] border border-[#D2DAFF] dark:border-slate-600 transition-colors shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-[#8487e8] dark:text-[#AAC4FF]" />
                <span>Try Demo Audio (1-Click Test)</span>
              </button>
            </div>

            {/* Security Guarantee badge */}
            <div className="pt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Client-Side. No files ever leave your device.</span>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace when file is loaded */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* File Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF1FF] dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-[#AAC4FF]">
                <FileAudio className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-[#EEF1FF] max-w-xs sm:max-w-md truncate">
                  {fileName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {fileSize} • {originalBuffer.numberOfChannels === 2 ? 'Stereo' : 'Mono'} • {originalBuffer.sampleRate} Hz
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {t.changeFile}
            </button>
          </div>

          {/* Silence Detection Parameters & Presets Card */}
          <div className="bg-white/90 dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#8487e8] dark:text-[#B1B2FF]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-[#EEF1FF]">
                  {t.settingsTitle}
                </h3>
              </div>

              {/* Presets Pill Group */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1 hidden sm:inline">{t.presetLabel}:</span>
                {(['podcast', 'audiobook', 'aggressive', 'gentle'] as PresetKey[]).map((pkey) => (
                  <button
                    key={pkey}
                    type="button"
                    onClick={() => handleApplyPreset(pkey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedPreset === pkey
                        ? 'bg-[#B1B2FF] text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#D2DAFF] dark:hover:bg-slate-700'
                    }`}
                  >
                    {t.presets[pkey]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: dB Threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.thresholdLabel}
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EEF1FF] dark:bg-slate-800 text-slate-800 dark:text-[#AAC4FF]">
                    {thresholdDb} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="-15"
                  step="1"
                  value={thresholdDb}
                  onChange={(e) => {
                    setThresholdDb(parseInt(e.target.value));
                    setSelectedPreset('gentle' as PresetKey); // marks as custom/modified
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-[#B1B2FF]"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {t.thresholdHelp}
                </p>
              </div>

              {/* Slider 2: Minimum Silence Duration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.minSilenceLabel}
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EEF1FF] dark:bg-slate-800 text-slate-800 dark:text-[#AAC4FF]">
                    {minSilenceMs} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="25"
                  value={minSilenceMs}
                  onChange={(e) => {
                    setMinSilenceMs(parseInt(e.target.value));
                    setSelectedPreset('gentle' as PresetKey);
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-[#B1B2FF]"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {t.minSilenceHelp}
                </p>
              </div>

              {/* Slider 3: Safety Padding */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.paddingLabel}
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EEF1FF] dark:bg-slate-800 text-slate-800 dark:text-[#AAC4FF]">
                    {paddingMs} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={paddingMs}
                  onChange={(e) => {
                    setPaddingMs(parseInt(e.target.value));
                    setSelectedPreset('gentle' as PresetKey);
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-[#B1B2FF]"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {t.paddingHelp}
                </p>
              </div>
            </div>

            {/* Recalculate / Process button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReProcess}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-tr from-[#B1B2FF] to-[#AAC4FF] hover:opacity-95 text-slate-900 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? t.processingButton : t.reprocessButton}</span>
              </button>
            </div>
          </div>

          {/* Interactive Waveform Visualization */}
          <div className="bg-white/90 dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-[#EEF1FF]">
              {t.previewTitle}
            </h3>

            <AudioWaveform
              buffer={activeSource === 'trimmed' ? trimmedBuffer : originalBuffer}
              activeSegments={activeSegments}
              silentSegments={activeSource === 'trimmed' ? [] : silentSegments}
              currentTime={currentTime}
              duration={(activeSource === 'trimmed' ? trimmedBuffer?.duration : originalBuffer?.duration) || 0}
              onSeek={(time) => setCurrentTime(time)}
              legendAudible={t.waveformLegendAudible}
              legendSilent={t.waveformLegendSilent}
            />

            {/* Audio Player Controls */}
            <AudioPlayer
              originalBuffer={originalBuffer}
              trimmedBuffer={trimmedBuffer}
              currentTime={currentTime}
              onTimeUpdate={(time) => setCurrentTime(time)}
              activeSource={activeSource}
              onSourceChange={(src) => setActiveSource(src)}
              listenOriginalText={t.listenOriginal}
              listenTrimmedText={t.listenTrimmed}
              onSeek={(time) => setCurrentTime(time)}
            />
          </div>

          {/* Trimming Statistics Overview Dashboard */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Original Length */}
              <div className="bg-white dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.originalDuration}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
                  {formatTime(stats.originalDurationSec)}
                </div>
              </div>

              {/* Trimmed Length */}
              <div className="bg-white dark:bg-slate-900 border border-[#B1B2FF] dark:border-indigo-900/60 rounded-2xl p-4 shadow-2xs bg-gradient-to-br from-white to-[#EEF1FF]/60 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-[#8487e8] dark:text-[#AAC4FF] font-semibold mb-1">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{t.trimmedDuration}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatTime(stats.trimmedDurationSec)}
                </div>
              </div>

              {/* Time Saved */}
              <div className="bg-white dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.timeSaved}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  -{stats.savedPercentage.toFixed(1)}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({stats.savedSeconds.toFixed(1)}s saved)
                </div>
              </div>

              {/* Cuts Count */}
              <div className="bg-white dark:bg-slate-900 border border-[#D2DAFF] dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Scissors className="w-3.5 h-3.5 text-[#8487e8]" />
                  <span>{t.cutsRemoved}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
                  {stats.cutCount}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Micro-crossfaded
                </div>
              </div>
            </div>
          )}

          {/* Export Actions Bar */}
          <div className="bg-gradient-to-r from-[#D2DAFF]/60 via-[#AAC4FF]/40 to-[#B1B2FF]/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-[#B1B2FF] dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Audio Cleaned and Ready</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Processed locally in browser memory with click-free micro-crossfades.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Download Studio WAV */}
              <button
                type="button"
                onClick={handleDownloadWav}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadWav}</span>
              </button>

              {/* Download MP3 */}
              <button
                type="button"
                onClick={handleDownloadMp3}
                disabled={isEncodingMp3}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#B1B2FF] hover:bg-[#AAC4FF] text-slate-900 shadow-sm transition-all active:scale-95 disabled:opacity-60"
              >
                <FileDown className={`w-4 h-4 ${isEncodingMp3 ? 'animate-bounce' : ''}`} />
                <span>{isEncodingMp3 ? t.encodingMp3 : t.downloadMp3}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
