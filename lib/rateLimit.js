
export function rateLimit({ interval, limit }) {
  const tokenCache = new Map();
  const timestamps = new Map();
  
  return {
    check: (token) => {
      const now = Date.now();
      
      // Clean old entries
      if (!timestamps.has(token)) {
        timestamps.set(token, now);
      } else {
        const lastTimestamp = timestamps.get(token);
        if (now - lastTimestamp > interval) {
          tokenCache.delete(token);
          timestamps.set(token, now);
        }
      }
      
      // Check rate limit
      let tokenCount = tokenCache.get(token) || 0;
      
      if (tokenCount >= limit) {
        return Promise.reject(new Error('Rate limit exceeded'));
      }
      
      tokenCache.set(token, tokenCount + 1);
      return Promise.resolve();
    }
  };
}