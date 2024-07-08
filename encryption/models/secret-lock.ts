import { pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_LOCK_NC_LENGTH = 32;
export const SECRET_LOCK_DERIVED_LENGTH = 32;
export const SECRET_LOCK_NC_ITERATIONS = 100000;

export default class SecretLock {
  pk: string;
  pw: string;

  constructor(pk: string, pw: string) {
    this.pk = pk;
    this.pw = pw;
  }

  toString(): string {
    return "[pk=" + this.pk + ", pw=" + this.pw + "]";
  }

  static async withPassword(pw: string): Promise<SecretLock> {
    const pk = await randomBytes(SECRET_LOCK_NC_LENGTH);
    return new SecretLock(pk, pw);
  }

  async derive(): Promise<string> {
    return await pbkdf2(
      this.pw,
      this.pk,
      SECRET_LOCK_NC_ITERATIONS,
      SECRET_LOCK_DERIVED_LENGTH,
    );
  }
}
