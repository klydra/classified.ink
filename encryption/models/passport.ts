import type SecretLock from "./secret-lock.ts";
import { pbkdf2 } from "../crypto.ts";

export const PASSPORT_LENGTH = 32;
export const PASSPORT_ITERATIONS = 600000;

export default class Passport {
  passport: string;

  constructor(passport: string) {
    this.passport = passport;

    console.log("Created Passport " + this.describe());
  }

  static fromString(passport: string): Passport {
    return new Passport(passport);
  }

  static async fromLockAndKey(
    lock: SecretLock,
    encrypted: string,
  ): Promise<Passport> {
    console.log("Generating Passport...");

    const derived = await lock.proof();

    console.log("Calculating Passport...");

    const passport = await pbkdf2(
      derived,
      encrypted,
      PASSPORT_ITERATIONS,
      PASSPORT_LENGTH,
    );

    return new Passport(passport);
  }

  toString(): string {
    return this.passport;
  }

  describe(): string {
    return "[passport=" + this.passport + "]";
  }
}
