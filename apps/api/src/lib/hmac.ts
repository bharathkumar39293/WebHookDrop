// apps/api/src/lib/hmac.ts
import crypto from 'crypto';

/**
 * Signs a payload using HMAC-SHA256.
 * The recipient uses their 'secret' to verify the signature matches.
 * This proves the request actually came from WebhookDrop.
 */
export function signPayload(payload: string, secret: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
}
