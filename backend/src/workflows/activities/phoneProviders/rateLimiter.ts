// Simple in-memory token bucket. Each provider gets its own instance so one
// provider's limit never throttles calls to the others. Good enough for a
// single-worker-process deployment; a shared limiter (e.g. Redis) would be
// needed across multiple worker instances.
export class RateLimiter {
  private tokens: number
  private lastRefill: number

  constructor(
    private readonly maxTokens: number,
    private readonly refillIntervalMs: number
  ) {
    this.tokens = maxTokens
    this.lastRefill = Date.now()
  }

  private refill() {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    if (elapsed <= 0) return

    const tokensToAdd = (elapsed / this.refillIntervalMs) * this.maxTokens
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
      this.lastRefill = now
    }
  }

  async acquire(): Promise<void> {
    while (true) {
      this.refill()

      if (this.tokens >= 1) {
        this.tokens -= 1
        return
      }

      const waitMs = this.refillIntervalMs / this.maxTokens
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }
  }
}
