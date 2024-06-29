import crypto from "crypto";
import type SecretKey from "./secret-key.ts";
import type SecretLock from "./secret-lock.ts";
import NoteContent from "./note-content.ts";

export const NOTE_IV_LENGTH = 32;

export default class Note {
  iv: string;
  blob: string;

  constructor(iv: string, blob: string) {
    this.iv = iv;
    this.blob = blob;
  }

  static fromString(note: string): Note {
    return new Note(note.slice(0, NOTE_IV_LENGTH), note.slice(NOTE_IV_LENGTH));
  }

  toString(): string {
    return this.iv + this.blob;
  }

  static fromContent(
    content: NoteContent,
    secretKey: SecretKey,
    lock: SecretLock,
  ): Note {
    const iv = crypto.randomBytes(NOTE_IV_LENGTH).toString("hex");
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      secretKey.decrypt(lock),
      iv,
    );

    let encrypted = cipher.update(content.toJSON(), "utf8", "hex");
    encrypted += cipher.final("hex");

    return new Note(iv, encrypted);
  }

  decrypt(secretKey: SecretKey, lock: SecretLock): NoteContent {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      secretKey.decrypt(lock),
      this.iv,
    );

    let decrypted = decipher.update(this.blob, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return NoteContent.fromJSON(decrypted);
  }
}
