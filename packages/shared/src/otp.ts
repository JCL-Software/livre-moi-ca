export function generateOtp(length = 6): string {
  const digits = new Uint8Array(length);
  globalThis.crypto.getRandomValues(digits);
  return Array.from(digits, (n) => n % 10).join("");
}

export async function hashOtp(otp: string): Promise<string> {
  const encoded = new TextEncoder().encode(otp);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
