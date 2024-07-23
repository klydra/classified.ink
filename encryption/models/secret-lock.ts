import { pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_LOCK_PK_LENGTH_MIN = 32;
export const SECRET_LOCK_PK_LENGTH_MAX = 256;
export const SECRET_LOCK_PK_ITERATIONS = 600000;

export default class SecretLock {
  pk: string;
  pw: string;

  constructor(pk: string, pw: string) {
    this.pk = pk;
    this.pw = pw;

    console.log("Created SecretLock " + this.describe());
  }

  static async withPassword(strength: number, pw: string): Promise<SecretLock> {
    const pk = await randomBytes(strength);
    console.log(
      "Generated SecretLock [pk=" + pk + " @ " + strength + ", pw=" + pw + "]",
    );
    return new SecretLock(pk, pw);
  }

  length(): number {
    return this.pk.length / 2;
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
      this.length(),
    );

    console.log(
      "Derived SecretLock " + this.describe() + " with result " + derived,
    );

    return derived;
  }
}
