import { pbkdf2, randomBytes } from "../crypto.ts";

export const SECRET_LOCK_NC_LENGTH = 32;
export const SECRET_LOCK_DERIVED_LENGTH = 32;
export const SECRET_LOCK_NC_ITERATIONS = 100000;

export default class SecretLock {
  nc: string;
  password: string;

  constructor(nc: string, password: string) {
    this.nc = nc;
    this.password = password;
  }

  toString(): string {
    return "[nc=" + this.nc + ", password=" + this.password + "]";
  }

  static async withPassword(password: string): Promise<SecretLock> {
    const nc = await randomBytes(SECRET_LOCK_NC_LENGTH);
    return new SecretLock(nc, password);
  }

  async derive(): Promise<string> {
    return await pbkdf2(
      this.password,
      this.nc,
      SECRET_LOCK_NC_ITERATIONS,
      SECRET_LOCK_DERIVED_LENGTH,
    );
  }
}
