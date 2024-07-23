import { pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_LOCK_DERIVED_KEY_LENGTH = 32;
export const SECRET_LOCK_DERIVED_PROOF_LENGTH = 32;
export const SECRET_LOCK_PK_KEY_ITERATIONS = 600000;
export const SECRET_LOCK_PK_PROOF_ITERATIONS = 600000;
export const SECRET_LOCK_PK_LENGTH = 16;

export default class SecretLock {
  pk: string;
  pw: string;

  constructor(pk: string, pw: string) {
    this.pk = pk;
    this.pw = pw;

    console.log("Created SecretLock " + this.describe());
  }

  static async withPassword(pw: string): Promise<SecretLock> {
    const pk = await randomBytes(SECRET_LOCK_PK_LENGTH);
    return new SecretLock(pk, pw);
  }

  describe(): string {
    return "[pk=" + this.pk + ", pw=" + this.pw + "]";
  }

  async key(): Promise<string> {
    console.log("Deriving SecretLock key...");

    const derived = await pbkdf2(
      this.pw,
      this.pk,
      SECRET_LOCK_PK_KEY_ITERATIONS,
      SECRET_LOCK_DERIVED_KEY_LENGTH,
    );

    console.log(
      "Derived SecretLock key " + this.describe() + " with result " + derived,
    );

    return derived;
  }

  async proof(): Promise<string> {
    console.log("Deriving SecretLock proof...");

    const derived = (
      await pbkdf2(
        this.pw,
        this.pk,
        SECRET_LOCK_PK_PROOF_ITERATIONS,
        SECRET_LOCK_DERIVED_KEY_LENGTH + SECRET_LOCK_DERIVED_PROOF_LENGTH,
      )
    ).slice(SECRET_LOCK_DERIVED_KEY_LENGTH);

    console.log(
      "Derived SecretLock proof " + this.describe() + " with result " + derived,
    );

    return derived;
  }
}
