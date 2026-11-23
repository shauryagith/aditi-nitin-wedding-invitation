import fs from 'fs';
import path from 'path';

/**
 * Procedural Indian Wedding Classical Instrumental Music Generator
 * Generates an authentic, auspicious Raag Bhoopali / Mangal Dhun Shehnai & Sitar melody
 * with Tanpura drone and temple bell resonance.
 * Outputs a 16-bit 44.1kHz Stereo WAV file.
 */

const SAMPLE_RATE = 44100;
const DURATION_SECONDS = 32;
const NUM_CHANNELS = 2;
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION_SECONDS;

// Frequencies (Raag Bhoopali: Sa, Re, Ga, Pa, Dha, Sa')
const SA = 261.63; // C4
const RE = 293.66; // D4
const GA = 329.63; // E4
const PA = 392.00; // G4
const DHA = 440.00; // A4
const SA_HIGH = 523.25; // C5
const RE_HIGH = 587.33; // D5
const GA_HIGH = 659.25; // E5

// Auspicious Wedding Shehnai & Sitar Melody Score (Note, duration in beats, start beat)
// Tempo: 80 BPM (0.75s per beat)
const BEAT_DURATION = 0.75;

interface NoteEvent {
  note: number;
  startBeat: number;
  durationBeats: number;
  instrument: 'shehnai' | 'sitar' | 'bell';
}

const MELODY: NoteEvent[] = [
  // Intro Tanpura & Shehnai Alaap (Beats 0 - 8)
  { note: SA, startBeat: 0.5, durationBeats: 2.5, instrument: 'shehnai' },
  { note: RE, startBeat: 3.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: GA, startBeat: 4.5, durationBeats: 3.0, instrument: 'shehnai' },
  { note: GA, startBeat: 0.0, durationBeats: 1.0, instrument: 'bell' },

  // Sitar Plucks (Beats 4 - 8)
  { note: SA, startBeat: 4.0, durationBeats: 0.8, instrument: 'sitar' },
  { note: GA, startBeat: 5.0, durationBeats: 0.8, instrument: 'sitar' },
  { note: PA, startBeat: 6.0, durationBeats: 0.8, instrument: 'sitar' },
  { note: DHA, startBeat: 7.0, durationBeats: 0.8, instrument: 'sitar' },

  // Section 2: Ascending Wedding Joy (Beats 8 - 16)
  { note: PA, startBeat: 8.0, durationBeats: 2.0, instrument: 'shehnai' },
  { note: DHA, startBeat: 10.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: SA_HIGH, startBeat: 11.5, durationBeats: 2.5, instrument: 'shehnai' },
  { note: RE_HIGH, startBeat: 14.0, durationBeats: 1.0, instrument: 'shehnai' },
  { note: SA_HIGH, startBeat: 15.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: SA_HIGH, startBeat: 8.0, durationBeats: 1.0, instrument: 'bell' },

  // Sitar Response (Beats 12 - 16)
  { note: SA_HIGH, startBeat: 12.0, durationBeats: 0.6, instrument: 'sitar' },
  { note: DHA, startBeat: 13.0, durationBeats: 0.6, instrument: 'sitar' },
  { note: PA, startBeat: 14.0, durationBeats: 0.6, instrument: 'sitar' },
  { note: GA, startBeat: 15.0, durationBeats: 0.6, instrument: 'sitar' },

  // Section 3: Celebratory Gat (Beats 16 - 24)
  { note: GA_HIGH, startBeat: 16.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: RE_HIGH, startBeat: 17.5, durationBeats: 1.0, instrument: 'shehnai' },
  { note: SA_HIGH, startBeat: 18.5, durationBeats: 1.5, instrument: 'shehnai' },
  { note: DHA, startBeat: 20.0, durationBeats: 1.0, instrument: 'shehnai' },
  { note: PA, startBeat: 21.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: GA, startBeat: 22.5, durationBeats: 1.5, instrument: 'shehnai' },
  { note: PA, startBeat: 16.0, durationBeats: 1.0, instrument: 'bell' },

  // Sitar Jhala (Fast arpeggio, Beats 20 - 24)
  { note: SA, startBeat: 20.0, durationBeats: 0.4, instrument: 'sitar' },
  { note: GA, startBeat: 20.5, durationBeats: 0.4, instrument: 'sitar' },
  { note: PA, startBeat: 21.0, durationBeats: 0.4, instrument: 'sitar' },
  { note: DHA, startBeat: 21.5, durationBeats: 0.4, instrument: 'sitar' },
  { note: SA_HIGH, startBeat: 22.0, durationBeats: 0.5, instrument: 'sitar' },
  { note: RE_HIGH, startBeat: 22.5, durationBeats: 0.5, instrument: 'sitar' },
  { note: GA_HIGH, startBeat: 23.0, durationBeats: 0.8, instrument: 'sitar' },

  // Section 4: Auspicious Resolution (Beats 24 - 32)
  { note: RE, startBeat: 24.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: GA, startBeat: 25.5, durationBeats: 1.5, instrument: 'shehnai' },
  { note: RE, startBeat: 27.0, durationBeats: 1.5, instrument: 'shehnai' },
  { note: SA, startBeat: 28.5, durationBeats: 3.5, instrument: 'shehnai' },
  { note: SA, startBeat: 24.0, durationBeats: 1.0, instrument: 'bell' },

  { note: PA, startBeat: 27.0, durationBeats: 0.8, instrument: 'sitar' },
  { note: GA, startBeat: 28.0, durationBeats: 0.8, instrument: 'sitar' },
  { note: RE, startBeat: 29.0, durationBeats: 0.8, instrument: 'sitar' },
  { note: SA, startBeat: 30.0, durationBeats: 1.5, instrument: 'sitar' },
];

function generateAudioBuffer(): Buffer {
  const numSamples = TOTAL_SAMPLES;
  const leftChannel = new Float32Array(numSamples);
  const rightChannel = new Float32Array(numSamples);

  // 1. Synthesize Continuous Tanpura Drone (Sa & Pa harmonics)
  const tanpuraFrequencies = [
    { freq: PA / 2, amp: 0.12, pan: -0.4 }, // Low Pa (G3)
    { freq: SA, amp: 0.16, pan: 0.4 },     // Sa (C4)
    { freq: SA * 2, amp: 0.08, pan: -0.2 }, // High Sa
    { freq: PA, amp: 0.06, pan: 0.2 },     // Pa (G4)
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Tanpura string cycle (continuous shimmer ~ 4 seconds per cycle)
    const cycle = (t % 4.0) / 4.0;
    const tanpuraStrum = Math.sin(cycle * Math.PI * 2);

    for (const string of tanpuraFrequencies) {
      // Harmonic series: fundamental + 2nd, 3rd, 4th harmonics
      const f = string.freq;
      const wave =
        Math.sin(2 * Math.PI * f * t) * 0.6 +
        Math.sin(2 * Math.PI * f * 2 * t) * 0.25 +
        Math.sin(2 * Math.PI * f * 3 * t) * 0.15 +
        Math.sin(2 * Math.PI * f * 4 * t) * 0.08;

      const envelope = string.amp * (0.8 + 0.2 * Math.sin(t * 1.5 + string.pan));
      const sample = wave * envelope;

      // Panning
      leftChannel[i] += sample * (0.5 - string.pan * 0.3);
      rightChannel[i] += sample * (0.5 + string.pan * 0.3);
    }
  }

  // 2. Synthesize Melodic Notes (Shehnai, Sitar, Bell)
  for (const event of MELODY) {
    const startSample = Math.floor(event.startBeat * BEAT_DURATION * SAMPLE_RATE);
    const durationSamples = Math.floor(event.durationBeats * BEAT_DURATION * SAMPLE_RATE);
    const endSample = Math.min(startSample + durationSamples, numSamples);

    for (let i = startSample; i < endSample; i++) {
      const localT = (i - startSample) / SAMPLE_RATE;
      const totalT = event.durationBeats * BEAT_DURATION;
      const progress = localT / totalT;
      const t = i / SAMPLE_RATE;

      let sample = 0;

      if (event.instrument === 'shehnai') {
        // Shehnai: Rich reed instrument with gentle vibrato and portamento
        const vibrato = Math.sin(2 * Math.PI * 5.0 * localT) * (event.note * 0.015);
        const freq = event.note + vibrato;

        // Rich reed timbre (harmonics)
        const wave =
          Math.sin(2 * Math.PI * freq * t) * 0.45 +
          Math.sin(2 * Math.PI * freq * 2 * t) * 0.30 +
          Math.sin(2 * Math.PI * freq * 3 * t) * 0.25 +
          Math.sin(2 * Math.PI * freq * 4 * t) * 0.15 +
          Math.sin(2 * Math.PI * freq * 5 * t) * 0.10 +
          Math.sin(2 * Math.PI * freq * 6 * t) * 0.05;

        // ADSR Envelope (Smooth attack, sustained body, gentle release)
        let env = 1.0;
        const attackTime = 0.08;
        const releaseTime = 0.15;
        if (localT < attackTime) {
          env = localT / attackTime;
        } else if (progress > 0.8) {
          env = (1 - progress) / 0.2;
        }

        sample = wave * env * 0.38;
        leftChannel[i] += sample * 0.52;
        rightChannel[i] += sample * 0.48;
      } else if (event.instrument === 'sitar') {
        // Sitar: Plucked string with bright metallic jawari buzz
        const freq = event.note;
        // Jawari overtones
        const wave =
          Math.sin(2 * Math.PI * freq * t) * 0.4 +
          Math.sin(2 * Math.PI * freq * 2 * t) * 0.35 +
          Math.sin(2 * Math.PI * freq * 3 * t) * 0.25 +
          Math.sin(2 * Math.PI * freq * 5 * t) * 0.15;

        // Exponential decay for plucked string
        const env = Math.exp(-localT * 3.5);
        sample = wave * env * 0.32;

        leftChannel[i] += sample * 0.45;
        rightChannel[i] += sample * 0.55;
      } else if (event.instrument === 'bell') {
        // Temple Bell: Pure resonant chime
        const freq = event.note * 2;
        const wave =
          Math.sin(2 * Math.PI * freq * t) * 0.5 +
          Math.sin(2 * Math.PI * (freq * 2.76) * t) * 0.3 +
          Math.sin(2 * Math.PI * (freq * 5.4) * t) * 0.15;

        const env = Math.exp(-localT * 2.0);
        sample = wave * env * 0.15;

        leftChannel[i] += sample * 0.5;
        rightChannel[i] += sample * 0.5;
      }
    }
  }

  // 3. Smooth Loop Fade In and Fade Out (0.5 seconds at boundaries)
  const fadeSamples = Math.floor(0.5 * SAMPLE_RATE);
  for (let i = 0; i < fadeSamples; i++) {
    const fade = i / fadeSamples;
    leftChannel[i] *= fade;
    rightChannel[i] *= fade;

    const endIdx = numSamples - 1 - i;
    leftChannel[endIdx] *= fade;
    rightChannel[endIdx] *= fade;
  }

  // 4. Encode to 16-bit PCM WAV Buffer
  const bytesPerSample = 2;
  const blockAlign = NUM_CHANNELS * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM = 1)
  buffer.writeUInt16LE(NUM_CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Interleave L and R samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Soft clip to [-1, 1]
    const left = Math.max(-1, Math.min(1, leftChannel[i]));
    const right = Math.max(-1, Math.min(1, rightChannel[i]));

    // Convert to 16-bit integer [-32768, 32767]
    const intLeft = Math.floor(left < 0 ? left * 32768 : left * 32767);
    const intRight = Math.floor(right < 0 ? right * 32768 : right * 32767);

    buffer.writeInt16LE(intLeft, offset);
    buffer.writeInt16LE(intRight, offset + 2);
    offset += 4;
  }

  return buffer;
}

// Write the generated audio to frontend/public/music and backend/public/uploads
async function main() {
  console.log('Generating Royal Wedding Shehnai & Sitar Melody...');
  const wavBuffer = generateAudioBuffer();

  const frontendMusicDir = path.resolve('frontend/public/music');
  if (!fs.existsSync(frontendMusicDir)) {
    fs.mkdirSync(frontendMusicDir, { recursive: true });
  }

  const outFilePath = path.join(frontendMusicDir, 'royal-wedding-shehnai.wav');
  fs.writeFileSync(outFilePath, wavBuffer);
  console.log(`Saved audio to: ${outFilePath} (${(wavBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

  // Also write to backend/public/uploads
  const backendUploadsDir = path.resolve('backend/public/uploads');
  if (!fs.existsSync(backendUploadsDir)) {
    fs.mkdirSync(backendUploadsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(backendUploadsDir, 'royal-wedding-shehnai.wav'), wavBuffer);
  console.log('Audio file generation complete.');
}

main().catch(console.error);
