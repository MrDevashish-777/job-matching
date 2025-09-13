// Simple keyword-based matching between job requirements and worker skills
export function normalize(tokens: string[]): string[] {
  return Array.from(new Set(tokens.map(t => t.trim().toLowerCase()).filter(Boolean)));
}

export function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, ' ')
    .split(/[\s,]+/)
    .filter(w => w.length > 2);
  return normalize(words);
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  const intersection = Array.from(A).filter(x => B.has(x)).length;
  const union = new Set([...Array.from(A), ...Array.from(B)]).size;
  return union === 0 ? 0 : intersection / union;
}

export function rankWorkers(skillsRequired: string[], jobDescription: string, workers: { _id: string; skills: string[] }[]) {
  const jobKeywords = normalize([...skillsRequired, ...extractKeywords(jobDescription)]);
  return workers
    .map(w => {
      const score = jaccardSimilarity(jobKeywords, normalize(w.skills));
      return { workerId: w._id, score };
    })
    .sort((a, b) => b.score - a.score);
}