import { pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_LOCK_NC_LENGTH = 32;
export const SECRET_LOCK_DERIVED_LENGTH = 32;
export const SECRET_LOCK_NC_ITERATIONS = 100000;

export default class SecretLock {
  pk: string;
  pw: string;

  constructor(nc: string, pw: string) {
    this.pk = nc;
    this.pw = pw;
  }

  toString(): string {
    return "[nc=" + this.pk + ", pw=" + this.pw + "]";
  }

  static async withPassword(pw: string): Promise<SecretLock> {
    const nc = await randomBytes(SECRET_LOCK_NC_LENGTH);
    return new SecretLock(nc, pw);
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
