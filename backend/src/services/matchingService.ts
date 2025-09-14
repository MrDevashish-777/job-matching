import { cosineSimilarity } from './embeddingService';

// Rank by cosine similarity using precomputed embeddings
export function rankByEmbedding<T extends { _id: any; embedding?: number[] }>(
  sourceEmbedding: number[],
  items: T[],
  limit = 50
) {
  const scored = items
    .map((it) => ({ id: it._id.toString(), score: it.embedding && it.embedding.length ? cosineSimilarity(sourceEmbedding, it.embedding) : 0 }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}