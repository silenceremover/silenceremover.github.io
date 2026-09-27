import lamejs from 'lamejs';

export interface SilenceDetectionOptions {
  thresholdDb: number;        // e.g. -36 dB
  minSilenceDurationMs: number; // e.g. 300 ms
  paddingMs: number;           // e.g. 40 ms
  minSoundDurationMs?: number; // e.g. 50 ms
}

export interface AudioSegment {
  startSec: number;
  endSec: number;
}

export interface TrimmingStats {
  originalDurationSec: number;
  trimmedDurationSec: number;
  savedSeconds: number;
  savedPercentage: number;
  cutCount: number;
}

export interface ProcessedAudioResult {
  originalBuffer: AudioBuffer;
  trimmedBuffer: AudioBuffer;
  activeSegments: AudioSegment[];
  silentSegments: AudioSegment[];
  stats: TrimmingStats;
  wavBlob: Blob;
}

/**
 * Detect active and silent audio segments based on RMS energy in decibels.
 */
export function detectAudioSegments(
  audioBuffer: AudioBuffer,
  options: SilenceDetectionOptions
): { activeSegments: AudioSegment[]; silentSegments: AudioSegment[] } {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const totalSamples = audioBuffer.length;
  const totalDurationSec = audioBuffer.duration;

  // Analysis window size: ~10ms
  const windowSize = Math.max(64, Math.floor(sampleRate * 0.01));
  const totalWindows = Math.floor(totalSamples / windowSize);

  // Get channel data arrays
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(audioBuffer.getChannelData(c));
  }

  // Calculate dB for each window
  const windowIsActive: boolean[] = new Array(totalWindows);
  const minSoundDurationMs = options.minSoundDurationMs || 50;

  for (let w = 0; w < totalWindows; w++) {
    const startSample = w * windowSize;
    let maxChannelRms = 0;

    for (let c = 0; c < numChannels; c++) {
      const data = channels[c];
      let sumSq = 0;
      for (let i = 0; i < windowSize; i++) {
        const sample = data[startSample + i];
        sumSq += sample * sample;
      }
      const rms = Math.sqrt(sumSq / windowSize);
      if (rms > maxChannelRms) {
        maxChannelRms = rms;
      }
    }

    // Convert to dB
    const db = maxChannelRms > 1e-7 ? 20 * Math.log10(maxChannelRms) : -140;
    windowIsActive[w] = db >= options.thresholdDb;
  }

  // Step 1: Group continuous active and silent runs
  interface RawRun {
    isActive: boolean;
    startWin: number;
    endWin: number;
  }
  const runs: RawRun[] = [];
  if (totalWindows > 0) {
    let currentIsActive = windowIsActive[0];
    let runStart = 0;

    for (let w = 1; w < totalWindows; w++) {
      if (windowIsActive[w] !== currentIsActive) {
        runs.push({
          isActive: currentIsActive,
          startWin: runStart,
          endWin: w
        });
        currentIsActive = windowIsActive[w];
        runStart = w;
      }
    }
    runs.push({
      isActive: currentIsActive,
      startWin: runStart,
      endWin: totalWindows
    });
  }

  // Step 2: If a silent run is shorter than minSilenceDurationMs, mark it as active
  const minSilenceWindows = Math.ceil((options.minSilenceDurationMs / 1000) * (sampleRate / windowSize));
  const activeNormalized: boolean[] = new Array(totalWindows).fill(false);

  for (const run of runs) {
    const durationWins = run.endWin - run.startWin;
    if (run.isActive) {
      for (let i = run.startWin; i < run.endWin; i++) {
        activeNormalized[i] = true;
      }
    } else {
      // If silence is too short, treat it as active
      if (durationWins < minSilenceWindows) {
        for (let i = run.startWin; i < run.endWin; i++) {
          activeNormalized[i] = true;
        }
      }
    }
  }

  // Step 3: Extract merged active intervals
  const initialActiveSegments: AudioSegment[] = [];
  let inActive = false;
  let activeStart = 0;

  for (let w = 0; w < totalWindows; w++) {
    if (activeNormalized[w] && !inActive) {
      inActive = true;
      activeStart = w;
    } else if (!activeNormalized[w] && inActive) {
      inActive = false;
      const startSec = (activeStart * windowSize) / sampleRate;
      const endSec = (w * windowSize) / sampleRate;
      initialActiveSegments.push({ startSec, endSec });
    }
  }
  if (inActive) {
    initialActiveSegments.push({
      startSec: (activeStart * windowSize) / sampleRate,
      endSec: totalDurationSec
    });
  }

  // Step 4: Apply padding (margin) to active segments
  const paddingSec = options.paddingMs / 1000;
  const paddedSegments: AudioSegment[] = initialActiveSegments.map(seg => ({
    startSec: Math.max(0, seg.startSec - paddingSec),
    endSec: Math.min(totalDurationSec, seg.endSec + paddingSec)
  }));

  // Step 5: Merge overlapping segments
  const mergedSegments: AudioSegment[] = [];
  for (const seg of paddedSegments) {
    if (mergedSegments.length === 0) {
      mergedSegments.push({ ...seg });
    } else {
      const prev = mergedSegments[mergedSegments.length - 1];
      if (seg.startSec <= prev.endSec) {
        // Overlap: merge
        prev.endSec = Math.max(prev.endSec, seg.endSec);
      } else {
        mergedSegments.push({ ...seg });
      }
    }
  }

  // Step 6: Filter out segments shorter than minSoundDurationMs
  const minSoundSec = minSoundDurationMs / 1000;
  const finalActiveSegments = mergedSegments.filter(s => (s.endSec - s.startSec) >= minSoundSec);

  // If entire audio was silence or nothing active found, fall back to keep original
  if (finalActiveSegments.length === 0) {
    return {
      activeSegments: [{ startSec: 0, endSec: totalDurationSec }],
      silentSegments: []
    };
  }

  // Compute silent intervals (the complement of active segments)
  const silentSegments: AudioSegment[] = [];
  let lastEnd = 0;
  for (const act of finalActiveSegments) {
    if (act.startSec > lastEnd + 0.005) {
      silentSegments.push({ startSec: lastEnd, endSec: act.startSec });
    }
    lastEnd = act.endSec;
  }
  if (lastEnd < totalDurationSec - 0.005) {
    silentSegments.push({ startSec: lastEnd, endSec: totalDurationSec });
  }

  return {
    activeSegments: finalActiveSegments,
    silentSegments
  };
}

/**
 * Splice active segments together with micro-crossfades to eliminate clicks and pops.
 */
export function renderTrimmedAudioBuffer(
  audioCtx: AudioContext,
  originalBuffer: AudioBuffer,
  activeSegments: AudioSegment[]
): AudioBuffer {
  const sampleRate = originalBuffer.sampleRate;
  const numChannels = originalBuffer.numberOfChannels;

  // Calculate total samples needed
  let totalTrimmedSamples = 0;
  const segmentSampleRanges = activeSegments.map(seg => {
    const startSample = Math.floor(seg.startSec * sampleRate);
    const endSample = Math.min(originalBuffer.length, Math.ceil(seg.endSec * sampleRate));
    const length = Math.max(0, endSample - startSample);
    totalTrimmedSamples += length;
    return { startSample, endSample, length };
  });

  if (totalTrimmedSamples === 0) {
    totalTrimmedSamples = originalBuffer.length;
  }

  const trimmedBuffer = audioCtx.createBuffer(numChannels, totalTrimmedSamples, sampleRate);
  // Micro-crossfade: 4ms to smoothly eliminate DC offset or cut pops
  const fadeLength = Math.min(256, Math.floor(sampleRate * 0.004));

  for (let c = 0; c < numChannels; c++) {
    const srcData = originalBuffer.getChannelData(c);
    const dstData = trimmedBuffer.getChannelData(c);
    let dstOffset = 0;

    for (let sIdx = 0; sIdx < segmentSampleRanges.length; sIdx++) {
      const { startSample, length } = segmentSampleRanges[sIdx];
      if (length <= 0) continue;

      for (let i = 0; i < length; i++) {
        let sample = srcData[startSample + i];

        // Apply fade-in at beginning of each segment
        if (i < fadeLength && (sIdx > 0 || startSample > 0)) {
          const fade = 0.5 * (1 - Math.cos((Math.PI * i) / fadeLength));
          sample *= fade;
        }

        // Apply fade-out at end of each segment
        const distFromEnd = length - 1 - i;
        if (distFromEnd < fadeLength && (sIdx < segmentSampleRanges.length - 1 || (startSample + length) < originalBuffer.length)) {
          const fade = 0.5 * (1 - Math.cos((Math.PI * distFromEnd) / fadeLength));
          sample *= fade;
        }

        dstData[dstOffset + i] = sample;
      }

      dstOffset += length;
    }
  }

  return trimmedBuffer;
}

/**
 * Encode AudioBuffer to standard 16-bit uncompressed PCM WAV Blob.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const wavSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(wavSize);
  const view = new DataView(arrayBuffer);

  // Helper to write ASCII strings
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // chunkSize
  writeString(8, 'WAVE');

  // "fmt " Sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);             // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);              // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);    // NumChannels
  view.setUint32(24, sampleRate, true);     // SampleRate
  view.setUint32(28, byteRate, true);       // ByteRate
  view.setUint16(32, blockAlign, true);     // BlockAlign
  view.setUint16(34, 16, true);             // BitsPerSample (16 bits)

  // "data" Sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);       // Subchunk2Size

  // Write interleaved 16-bit PCM samples
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      // Clamp between -1.0 and 1.0
      let s = Math.max(-1, Math.min(1, channels[c][i]));
      // Convert to 16-bit signed integer (-32768 to 32767)
      const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(offset, Math.floor(val), true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Encode AudioBuffer to MP3 Blob using lamejs.
 */
export async function audioBufferToMp3Blob(buffer: AudioBuffer, kbps: number = 192): Promise<Blob> {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;

  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data: Uint8Array[] = [];

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? buffer.getChannelData(1) : leftChannel;

  // Process in chunks of 1152 samples (standard MP3 frame size)
  const chunkSize = 1152;
  const leftInt16 = new Int16Array(chunkSize);
  const rightInt16 = new Int16Array(chunkSize);

  for (let i = 0; i < numSamples; i += chunkSize) {
    const currentChunkSize = Math.min(chunkSize, numSamples - i);

    for (let j = 0; j < currentChunkSize; j++) {
      const leftVal = Math.max(-1, Math.min(1, leftChannel[i + j]));
      leftInt16[j] = leftVal < 0 ? leftVal * 0x8000 : leftVal * 0x7FFF;

      const rightVal = Math.max(-1, Math.min(1, rightChannel[i + j]));
      rightInt16[j] = rightVal < 0 ? rightVal * 0x8000 : rightVal * 0x7FFF;
    }

    // Zero out remainder of chunk if last chunk
    for (let j = currentChunkSize; j < chunkSize; j++) {
      leftInt16[j] = 0;
      rightInt16[j] = 0;
    }

    let mp3buf: Int8Array;
    if (numChannels === 1) {
      mp3buf = mp3encoder.encodeBuffer(leftInt16);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftInt16, rightInt16);
    }

    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf.buffer, mp3buf.byteOffset, mp3buf.length));
    }
  }

  // Flush remaining buffer
  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(new Uint8Array(endBuf.buffer, endBuf.byteOffset, endBuf.length));
  }

  return new Blob(mp3Data, { type: 'audio/mp3' });
}

/**
 * Generates an in-memory synthetic speech sample with clear pauses,
 * allowing users to test the app instantly without uploading their own file!
 */
export function createDemoAudioBuffer(audioCtx: AudioContext): AudioBuffer {
  const sampleRate = audioCtx.sampleRate || 44100;
  const totalDurationSec = 8.0;
  const buffer = audioCtx.createBuffer(2, Math.floor(sampleRate * totalDurationSec), sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Pattern:
  // 0.0 - 1.5s: Phrase 1 ("Hello and welcome to SilenceRemover")
  // 1.5 - 3.2s: SILENCE (1.7s awkward pause)
  // 3.2 - 4.8s: Phrase 2 ("This test audio demonstrates instant trimming")
  // 4.8 - 6.5s: SILENCE (1.7s pause)
  // 6.5 - 7.8s: Phrase 3 ("Enjoy seamless, private audio editing!")
  // 7.8 - 8.0s: Silence

  const phrases = [
    { start: 0.2, end: 1.5, baseFreq: 220 },
    { start: 3.2, end: 4.8, baseFreq: 260 },
    { start: 6.2, end: 7.8, baseFreq: 240 }
  ];

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    let sample = 0;

    for (const phrase of phrases) {
      if (t >= phrase.start && t <= phrase.end) {
        const localT = t - phrase.start;
        // Speech-like formant harmonics + envelope
        const envelope = Math.sin((Math.PI * localT) / (phrase.end - phrase.start));
        const f1 = Math.sin(2 * Math.PI * phrase.baseFreq * localT);
        const f2 = 0.5 * Math.sin(2 * Math.PI * phrase.baseFreq * 2 * localT);
        const f3 = 0.25 * Math.sin(2 * Math.PI * phrase.baseFreq * 3.5 * localT);
        const noise = (Math.random() - 0.5) * 0.05;
        sample = (f1 + f2 + f3 + noise) * envelope * 0.6;
        break;
      }
    }

    left[i] = sample;
    right[i] = sample;
  }

  return buffer;
}

/**
 * Format seconds into mm:ss or hh:mm:ss.
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
