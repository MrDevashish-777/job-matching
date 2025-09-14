import fs from 'fs';
import path from 'path';
import { Model, KaldiRecognizer } from 'vosk';

// Vosk model path should be downloaded locally for demo (small model recommended)
// e.g., place at backend/models/vosk-model-small-en-us-0.15
const MODEL_PATH = process.env.VOSK_MODEL_PATH || path.join(__dirname, '../../models/vosk-model-small-en-us-0.15');

let model: Model | null = null;

export function ensureVoskModel() {
  if (!model) {
    if (!fs.existsSync(MODEL_PATH)) {
      throw new Error(`Vosk model not found at ${MODEL_PATH}. Download a small model and set VOSK_MODEL_PATH.`);
    }
    model = new Model(MODEL_PATH);
  }
  return model;
}

// Transcribe a WAV audio buffer (mono PCM 16kHz recommended for best accuracy)
export async function transcribeWav(buffer: Buffer): Promise<string> {
  const m = ensureVoskModel();
  const rec = new KaldiRecognizer(m, 16000);
  rec.setWords(true);
  // Feed raw PCM WAV data (expecting stripped header if necessary)
  rec.acceptWaveform(buffer);
  const final = JSON.parse(rec.finalResult());
  return final.text || '';
}

// Simple regex parsing from transcript to extract skills, experience, languages
export function parseProfileFromText(text: string) {
  const lower = text.toLowerCase();
  // naive: split on common separators
  const words = lower.split(/[^a-z]+/).filter(Boolean);
  const possibleSkills = ['carpentry','plumbing','electrician','maid','cooking','driving','gardening','painting','masonry','cleaning','tailoring'];
  const skills = Array.from(new Set(words.filter(w => possibleSkills.includes(w))));

  const expMatch = lower.match(/(\d+)\s*(years?|yrs?)/);
  const experienceYears = expMatch ? parseInt(expMatch[1], 10) : undefined;

  const possibleLanguages = ['english','hindi','bengali','tamil','telugu','marathi','gujarati','kannada','punjabi','urdu'];
  const languages = Array.from(new Set(words.filter(w => possibleLanguages.includes(w))));

  return { skills, experienceYears, languages };
}