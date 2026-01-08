import { RATE_LIMIT } from './constants.js';

let requestCount = {
  second: 0,
  month: 0,
  lastReset: Date.now(),
};

export function checkRateLimit() {
  const now = Date.now();
  if (now - requestCount.lastReset > 1000) {
    requestCount.second = 0;
    requestCount.lastReset = now;
  }
  if (requestCount.second >= RATE_LIMIT.perSecond || requestCount.month >= RATE_LIMIT.perMonth) {
    throw new Error('Rate limit exceeded');
  }
  requestCount.second++;
  requestCount.month++;
}

export function stringify(data: any, pretty = false) {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch with automatic retry on HTTP 429 (rate limit). */
export async function fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    await sleep(1200);
  }
  throw new Error('Rate limit exceeded after retries');
}
