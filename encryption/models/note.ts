import type SecretKey from "./secret-key.ts";
import type SecretLock from "./secret-lock.ts";
import NoteContent from "./note-content.ts";
import { decryptIV, encryptIV, randomBytes } from "../crypto.ts";

export const NOTE_IV_LENGTH = 16;

export default class Note {
  iv: string;
  blob: string;

  constructor(iv: string, blob: string) {
    this.iv = iv;
    this.blob = blob;

    console.log("Created Note " + this.describe());
  }

  static fromString(note: string): Note {
    return new Note(note.slice(0, NOTE_IV_LENGTH), note.slice(NOTE_IV_LENGTH));
  }

  static async fromContent(
    content: NoteContent,
    secretKey: SecretKey,
    lock: SecretLock,
  ): Promise<Note> {
    const iv = await randomBytes(NOTE_IV_LENGTH);
    const secret = await secretKey.decrypt(lock);

    console.log(
      "Generating encrypted Note [iv=" +
        iv +
        ", blob=" +
        content.toString() +
        "] with secret " +
        secret,
    );

    const encrypted = await encryptIV(secret, iv, content.toString());

    return new Note(iv, encrypted);
  }

  toString(): string {
    return this.iv + this.blob;
  }

  describe(): string {
    return "[iv=" + this.iv + ", blob=" + this.blob + "]";
  }

  async decrypt(secretKey: SecretKey, lock: SecretLock): Promise<NoteContent> {
    const secret = await secretKey.decrypt(lock);

    console.log(
      "Generating encrypted Note " + this.describe() + " with secret " + secret,
    );

    const decrypted = await decryptIV(secret, this.iv, this.blob);

    return NoteContent.fromString(decrypted);
  }
}
