import { decryptIV, encryptIV, randomBytes } from "../crypto.ts";
import SecretLock from "./secret-lock.ts";
import Passport, { PASSPORT_LENGTH } from "./passport.ts";

export const SECRET_KEY_IV_LENGTH = 16;
export const SECRET_KEY_BLOB_LENGTH = 32;
export const SECRET_KEY_BLOB_ENCRYPTED_LENGTH = 80;
export const SECRET_KEY_LENGTH =
  SECRET_KEY_IV_LENGTH + SECRET_KEY_BLOB_ENCRYPTED_LENGTH + PASSPORT_LENGTH;

export default class SecretKey {
  iv: string;
  blob: string;
  passport: Passport;

  constructor(iv: string, blob: string, passport: Passport) {
    this.iv = iv;
    this.blob = blob;
    this.passport = passport;

    console.log("Created SecretKey " + this.describe());
  }

  static fromString(secretKey: string): SecretKey {
    return new SecretKey(
      secretKey.slice(0, SECRET_KEY_IV_LENGTH * 2),
      secretKey.slice(
        SECRET_KEY_IV_LENGTH * 2,
        SECRET_KEY_IV_LENGTH * 2 + SECRET_KEY_BLOB_ENCRYPTED_LENGTH * 2,
      ),
      Passport.fromString(
        secretKey.slice(
          SECRET_KEY_IV_LENGTH * 2 + SECRET_KEY_BLOB_ENCRYPTED_LENGTH * 2,
          SECRET_KEY_IV_LENGTH * 2 +
            SECRET_KEY_BLOB_ENCRYPTED_LENGTH * 2 +
            PASSPORT_LENGTH * 2,
        ),
      ),
    );
  }

  static async withLock(lock: SecretLock): Promise<SecretKey> {
    console.log("Generating SecretKey...");

    const iv = await randomBytes(SECRET_KEY_IV_LENGTH);
    const secretKey = await randomBytes(SECRET_KEY_BLOB_LENGTH);

    const derived = await lock.key();

    console.log("Encrypting SecretKey...");

    const encrypted = await encryptIV(derived, iv, secretKey);

    const passport = await Passport.fromLockAndKey(lock, encrypted);

    return new SecretKey(iv, encrypted, passport);
  }

  toString(): string {
    return this.iv + this.blob + this.passport.toString();
  }

  describe(): string {
    return (
      "[iv=" +
      this.iv +
      ", blob=" +
      this.blob +
      ", passport=" +
      this.passport.describe() +
      "]"
    );
  }

  async decrypt(lock: SecretLock): Promise<string> {
    const derived = await lock.key();

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

    const passport = await Passport.fromLockAndKey(lock, this.blob);

    console.log(
      "Generated Proof for SecretKey " +
        this.describe() +
        " with result " +
        passport.toString(),
    );

    return passport.toString() === this.passport.toString();
  }
}
