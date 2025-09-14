import { pipeline } from "@xenova/transformers";
import { Worker } from "../models/Worker";
import { Job } from "../models/Job";

// Lazy singleton for DialoGPT
let chatPromise: Promise<any> | null = null;

export async function getChatbot() {
  if (!chatPromise) {
    // Using microsoft/DialoGPT-small (free)
    chatPromise = pipeline("text-generation", "microsoft/DialoGPT-small");
  }
  return chatPromise;
}

// Basic intent detection: look for job-related queries
function hasJobIntent(text: string) {
  const t = text.toLowerCase();
  return /(job|work|candidate|worker|hire|best|near|around|carpenter|plumber|electrician)/.test(t);
}

export async function askChat(text: string) {
  // If job intent, we might enrich with data
  let contextAddon = '';
  if (hasJobIntent(text)) {
    // Example heuristic: fetch a few top workers/jobs and include as context
    const workers = await Worker.find().limit(3).lean();
    const jobs = await Job.find().limit(3).lean();
    contextAddon = `\nContext workers: ${workers.map(w=>w.name).join(', ')}. Context jobs: ${jobs.map(j=>j.title).join(', ')}.`;
  }
  const chat = await getChatbot();
  const out = await chat(`${text}\n${contextAddon}`, { max_new_tokens: 80 });
  // transformers.js returns array with generated_text
  const textOut = Array.isArray(out) ? out[0].generated_text : String(out);
  return { reply: textOut.slice(0, 800) };
}