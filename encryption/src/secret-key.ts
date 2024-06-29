import crypto from "crypto";
import type SecretLock from "./secret-lock";

export default class SecretKey {
  iv: string;
  blob: string;

  constructor(iv: string, blob: string) {
    this.iv = iv;
    this.blob = blob;
  }

  static fromString(note: string): SecretKey {
    return new SecretKey(note.slice(0, 32), note.slice(32));
  }

  toString(): string {
    return this.iv + this.blob;
  }

  static withLock(lock: SecretLock): SecretKey {
    const iv = crypto.randomBytes(32).toString("hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", lock.derive(), iv);

    const secretKey = crypto.randomBytes(32).toString("hex");

    let encrypted = cipher.update(secretKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    return new SecretKey(iv, encrypted);
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
}
