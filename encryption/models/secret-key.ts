import type SecretLock from "./secret-lock.ts";
import { decryptIV, encryptIV, pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_KEY_IV_LENGTH = 16;
export const SECRET_KEY_PASSPORT_LENGTH = 32;
export const SECRET_KEY_PASSPORT_ITERATIONS = 100000;
export const SECRET_KEY_BLOB_LENGTH = 32;
export const SECRET_KEY_LENGTH =
  SECRET_KEY_IV_LENGTH + SECRET_KEY_PASSPORT_LENGTH + SECRET_KEY_BLOB_LENGTH;

export default class SecretKey {
  iv: string;
  passport: string;
  blob: string;

  constructor(iv: string, passport: string, blob: string) {
    this.iv = iv;
    this.passport = passport;
    this.blob = blob;
  }

  static fromString(note: string): SecretKey {
    return new SecretKey(
      note.slice(0, SECRET_KEY_IV_LENGTH),
      note.slice(
        SECRET_KEY_IV_LENGTH,
        SECRET_KEY_IV_LENGTH + SECRET_KEY_PASSPORT_LENGTH,
      ),
      note.slice(SECRET_KEY_IV_LENGTH + SECRET_KEY_PASSPORT_LENGTH),
    );
  }

  toString(): string {
    return this.iv + this.passport + this.blob;
  }

  static async withLock(lock: SecretLock): Promise<SecretKey> {
    const iv = await randomBytes(SECRET_KEY_IV_LENGTH);
    const secretKey = await randomBytes(SECRET_KEY_BLOB_LENGTH);

    const encrypted = await encryptIV(await lock.derive(), iv, secretKey);

    const passport = await pbkdf2(
      encrypted,
      await lock.derive(),
      SECRET_KEY_PASSPORT_ITERATIONS,
      SECRET_KEY_PASSPORT_LENGTH,
    );

    return new SecretKey(iv, passport, encrypted);
  }

  async decrypt(lock: SecretLock): Promise<string> {
    return await decryptIV(await lock.derive(), this.iv, this.blob);
  }

  async proof(derived: string): Promise<boolean> {
    const expected = await pbkdf2(
      this.blob,
      derived,
      SECRET_KEY_PASSPORT_ITERATIONS,
      SECRET_KEY_PASSPORT_LENGTH,
    );

    return expected === this.passport;
  }
}
