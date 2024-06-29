import crypto from "crypto";

export default class SecretLock {
  nc: string;
  password: string;

  constructor(nc: string, password: string) {
    this.nc = nc;
    this.password = password;
  }

  static withPassword(password: string): SecretLock {
    const nc = crypto.randomBytes(32).toString("hex");
    return new SecretLock(nc, password);
  }

  derive(): string {
    return crypto
      .pbkdf2Sync(this.password, this.nc, 1000, 32, "sha512")
      .toString("hex");
  }
}
