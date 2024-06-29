import crypto from "crypto";

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

  static withPassword(password: string): SecretLock {
    const nc = crypto.randomBytes(SECRET_LOCK_NC_LENGTH).toString("hex");
    return new SecretLock(nc, password);
  }

  derive(): string {
    return crypto
      .pbkdf2Sync(
        this.password,
        this.nc,
        SECRET_LOCK_NC_ITERATIONS,
        SECRET_LOCK_DERIVED_LENGTH,
        "sha512",
      )
      .toString("hex");
  }
}
