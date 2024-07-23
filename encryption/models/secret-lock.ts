import { pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_LOCK_DERIVED_LENGTH = 32;
export const SECRET_LOCK_PK_ITERATIONS = 600000;
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

  async derive(): Promise<string> {
    console.log("Deriving SecretLock...");

    const derived = await pbkdf2(
      this.pw,
      this.pk,
      SECRET_LOCK_PK_ITERATIONS,
      SECRET_LOCK_DERIVED_LENGTH,
    );

    console.log(
      "Derived SecretLock " + this.describe() + " with result " + derived,
    );

    return derived;
  }
}
