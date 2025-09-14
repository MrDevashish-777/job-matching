import { cosineSimilarity } from '../src/services/embeddingService';
import { rankByEmbedding } from '../src/services/matchingService';

describe('embedding matching', () => {
  it('cosineSimilarity returns 1 for identical vectors', () => {
    const v = [0.1, 0.2, 0.3];
    expect(cosineSimilarity(v, v)).toBeCloseTo(1, 5);
  });

  it('rankByEmbedding ranks higher for closer vectors', () => {
    const source = [1, 0, 0];
    const items = [
      { _id: 'a', embedding: [1, 0, 0] },
      { _id: 'b', embedding: [0.7, 0.1, 0] },
      { _id: 'c', embedding: [0, 1, 0] },
    ];
    const ranked = rankByEmbedding(source, items);
    expect(ranked[0].id).toBe('a');
  });
});