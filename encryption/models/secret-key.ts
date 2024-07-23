import { decryptIV, encryptIV, pbkdf2, randomBytes } from "../crypto.ts";
import SecretLock, { SECRET_LOCK_DERIVED_LENGTH } from "./secret-lock.ts";

export const SECRET_KEY_IV_LENGTH = 16;
export const SECRET_KEY_PASSPORT_LENGTH = SECRET_LOCK_DERIVED_LENGTH;
export const SECRET_KEY_PASSPORT_ITERATIONS = 600000;
export const SECRET_KEY_BLOB_LENGTH = 32;
export const SECRET_KEY_BLOB_ENCRYPTED_LENGTH = 80;
export const SECRET_KEY_LENGTH =
  SECRET_KEY_IV_LENGTH +
  SECRET_KEY_PASSPORT_LENGTH +
  SECRET_KEY_BLOB_ENCRYPTED_LENGTH;

export default class SecretKey {
  iv: string;
  passport: string;
  blob: string;

  constructor(iv: string, passport: string, blob: string) {
    this.iv = iv;
    this.passport = passport;
    this.blob = blob;

    console.log("Created SecretKey " + this.describe());
  }

  static fromString(secretKey: string): SecretKey {
    return new SecretKey(
      secretKey.slice(0, SECRET_KEY_IV_LENGTH * 2),
      secretKey.slice(
        SECRET_KEY_IV_LENGTH * 2,
        SECRET_KEY_IV_LENGTH * 2 + SECRET_KEY_PASSPORT_LENGTH * 2,
      ),
      secretKey.slice(
        SECRET_KEY_IV_LENGTH * 2 + SECRET_KEY_PASSPORT_LENGTH * 2,
      ),
    );
  }

  static async withLock(lock: SecretLock): Promise<SecretKey> {
    console.log("Generating SecretKey...");

    const iv = await randomBytes(SECRET_KEY_IV_LENGTH);
    const secretKey = await randomBytes(SECRET_KEY_BLOB_LENGTH);

    const derived = await lock.derive();

    console.log("Encrypting SecretKey...");

    const encrypted = await encryptIV(derived, iv, secretKey);

    console.log("Generating Passport...");

    const passport = await pbkdf2(
      encrypted,
      derived,
      SECRET_KEY_PASSPORT_ITERATIONS,
      SECRET_KEY_PASSPORT_LENGTH,
    );

    console.log(
      "Generating SecretKey [iv=" +
        iv +
        ", derived=" +
        derived +
        " -> passport=" +
        passport +
        ", blob=" +
        encrypted +
        "]",
    );

    return new SecretKey(iv, passport, encrypted);
  }

  toString(): string {
    return this.iv + this.passport + this.blob;
  }

  describe(): string {
    return (
      "[iv=" +
      this.iv +
      ", passport=" +
      this.passport +
      ", blob=" +
      this.blob +
      "]"
    );
  }

  async decrypt(lock: SecretLock): Promise<string> {
    const derived = await lock.derive();

    console.log("Decrypting SecretKey...");

    const decrypted = await decryptIV(derived, this.iv, this.blob);

    console.log(
      "Decrypted SecretKey " +
        this.describe() +
        " and derived lock " +
        derived +
        " with result " +
        decrypted,
    );

    return decrypted;
  }

  async proof(lock: SecretLock): Promise<boolean> {
    console.log("Generating Proof for SecretKey...");

    const derived = await lock.derive();
    const decrypted = await this.decrypt(lock);

    console.log("Encrypting SecretKey...");

    const encrypted = await encryptIV(derived, this.iv, decrypted);

    console.log("Generating Proof to match against...");

    const expected = await pbkdf2(
      encrypted,
      derived,
      SECRET_KEY_PASSPORT_ITERATIONS,
      SECRET_KEY_PASSPORT_LENGTH,
    );

    console.log(
      "Generated Proof for SecretKey " +
        this.describe() +
        " and derived lock " +
        derived +
        " with result " +
        expected,
    );

    return expected === this.passport;
  }
}
