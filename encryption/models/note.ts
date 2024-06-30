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
  }

  static fromString(note: string): Note {
    return new Note(note.slice(0, NOTE_IV_LENGTH), note.slice(NOTE_IV_LENGTH));
  }

  toString(): string {
    return this.iv + this.blob;
  }

  static async fromContent(
    content: NoteContent,
    secretKey: SecretKey,
    lock: SecretLock,
  ): Promise<Note> {
    const iv = await randomBytes(NOTE_IV_LENGTH);
    const encrypted = await encryptIV(
      await secretKey.decrypt(lock),
      iv,
      content.toString(),
    );

    return new Note(iv, encrypted);
  }

  async decrypt(secretKey: SecretKey, lock: SecretLock): Promise<NoteContent> {
    const decrypted = await decryptIV(
      await secretKey.decrypt(lock),
      this.iv,
      this.blob,
    );
    return NoteContent.fromString(decrypted);
  }
}
