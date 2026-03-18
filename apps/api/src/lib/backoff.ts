// apps/api/src/lib/backoff.ts

/**
 * Calculates exponential backoff with jitter.
 * Jitter prevents "thundering herd" by adding a bit of randomness 
 * so all failed retries don't hit the server at the exact same millisecond.
 */
export function getBackoffDelay(attempt: number): number {
    const base = 1000; // 1 second base
    const cap = 60_000; // 60 second max

    // Math.pow(2, attempt) doubles the wait each time (1, 2, 4, 8, 16...)
    const exp = Math.min(base * Math.pow(2, attempt), cap);

    // Add up to 30% random "jitter"
    const jitter = Math.random() * exp * 0.3;

    return Math.floor(exp + jitter);
}
