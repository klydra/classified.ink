import crypto from "crypto";
import type SecretLock from "./secret-lock.ts";

export const SECRET_KEY_IV_LENGTH = 32;
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

  static withLock(lock: SecretLock): SecretKey {
    const iv = crypto.randomBytes(SECRET_KEY_IV_LENGTH).toString("hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", lock.derive(), iv);

    const secretKey = crypto
      .randomBytes(SECRET_KEY_BLOB_LENGTH)
      .toString("hex");

    let encrypted = cipher.update(secretKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    const passport = crypto
      .pbkdf2Sync(
        encrypted,
        lock.derive(),
        SECRET_KEY_PASSPORT_ITERATIONS,
        SECRET_KEY_PASSPORT_LENGTH,
        "sha512",
      )
      .toString("hex");

    return new SecretKey(iv, passport, encrypted);
  }

  decrypt(lock: SecretLock): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      lock.derive(),
      this.iv,
    );

    let decrypted = decipher.update(this.blob, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  proof(derived: string): boolean {
    const expected = crypto
      .pbkdf2Sync(
        this.blob,
        derived,
        SECRET_KEY_PASSPORT_ITERATIONS,
        SECRET_KEY_PASSPORT_LENGTH,
        "sha512",
      )
      .toString("hex");

    return expected === this.passport;
  }
}
