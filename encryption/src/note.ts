import crypto from "crypto";
import type SecretKey from "./secret-key";
import type SecretLock from "./secret-lock";

export default class Note {
  iv: string;
  blob: string;

  constructor(iv: string, blob: string) {
    this.iv = iv;
    this.blob = blob;
  }

  static fromString(note: string): Note {
    return new Note(note.slice(0, 32), note.slice(32));
  }

  toString(): string {
    return this.iv + this.blob;
  }

  static fromContent(
    content: string,
    secretKey: SecretKey,
    lock: SecretLock,
  ): Note {
    const iv = crypto.randomBytes(32).toString("hex");
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      secretKey.decrypt(lock),
      iv,
    );

    let encrypted = cipher.update(content, "utf8", "hex");
    encrypted += cipher.final("hex");

    return new Note(iv, encrypted);
  }

  decrypt(secretKey: SecretKey, lock: SecretLock): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      secretKey.decrypt(lock),
      this.iv,
    );

    let decrypted = decipher.update(this.blob, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
