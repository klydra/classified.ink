const server =
  typeof window === "undefined" || typeof window.crypto === "undefined";

export async function randomBytes(length: number): Promise<string> {
  if (server)
    return (await import("crypto")).randomBytes(length).toString("hex");

  const randomBytes = window.crypto.getRandomValues(new Uint8Array(length));
  return uint8ArrayToHexString(randomBytes);
}

export async function pbkdf2(
  password: string,
  salt: string,
  iterations: number,
  length: number,
) {
  if (server)
    return (await import("crypto"))
      .pbkdf2Sync(password, salt, iterations, length, "sha512")
      .toString("hex");

  const passwordBuffer = utf8StringToUint8Array(password);
  const saltBuffer = hexStringToUint8Array(salt);

  const key = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey", "deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: iterations,
      hash: "SHA-512",
    },
    key,
    length * 8,
  );

  return arrayBufferToHexString(derivedBits);
}

export async function decryptIV(
  key: string,
  iv: string,
  encrypted: string,
): Promise<string> {
  if (server) {
    const decipher = (await import("crypto")).createDecipheriv(
      "aes-256-cbc",
      key,
      iv,
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  const keyBuffer = hexStringToUint8Array(key);
  const ivBuffer = hexStringToUint8Array(iv);
  const encryptedBuffer = hexStringToUint8Array(encrypted);

  const keyImported = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: ivBuffer,
    },
    keyImported,
    encryptedBuffer,
  );

  return arrayBufferToUtf8String(decrypted);
}

export async function encryptIV(
  key: string,
  iv: string,
  decrypted: string,
): Promise<string> {
  if (server) {
    const cipher = (await import("crypto")).createCipheriv(
      "aes-256-cbc",
      key,
      iv,
    );

    let encrypted = cipher.update(decrypted, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  }

  const keyBuffer = hexStringToUint8Array(key);
  const ivBuffer = hexStringToUint8Array(iv);
  const decryptedBuffer = utf8StringToUint8Array(decrypted);

  const keyImported = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: ivBuffer,
    },
    keyImported,
    decryptedBuffer,
  );

  return arrayBufferToHexString(encrypted);
}

function utf8StringToUint8Array(utf8String: string) {
  return new TextEncoder().encode(utf8String);
}

function uint8ArrayToUtf8String(uint8Array: Uint8Array) {
  return new TextDecoder().decode(uint8Array);
}

function arrayBufferToUtf8String(uint8Array: ArrayBuffer) {
  return uint8ArrayToUtf8String(new Uint8Array(uint8Array));
}

function hexStringToUint8Array(hexString: string) {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have even number of characters");
  }

  const uint8Array = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    const byteValue = parseInt(hexString.slice(i, i + 2), 16);
    if (isNaN(byteValue)) throw new Error("Invalid hexadecimal string");
    uint8Array[i / 2] = byteValue;
  }
  return uint8Array;
}

function uint8ArrayToHexString(uint8Array: Uint8Array) {
  return Array.from(uint8Array)
    .map((byte) => ("0" + byte.toString(16)).slice(-2))
    .join("");
}

function arrayBufferToHexString(uint8Array: ArrayBuffer) {
  return uint8ArrayToHexString(new Uint8Array(uint8Array));
}
