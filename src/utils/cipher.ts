import CryptoJS from 'crypto-js';

export interface EncryptionParams {
  key: string;
  iv: string;
}

export class DesEncryption {
  private key;
  private iv;

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key } = opt;
    if (key) {
      const newKey = CryptoJS.MD5(key).toString().substring(0, 8);
      this.key = CryptoJS.enc.Utf8.parse(newKey);
      this.iv = CryptoJS.enc.Utf8.parse(newKey);
    }
  }

  get getOptions() {
    return {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.iv,
    };
  }

  encrypt(cipherText: string) {
    return CryptoJS.DES.encrypt(cipherText, this.key, this.getOptions).ciphertext.toString();
  }

  decrypt(cipherText: string) {
    return CryptoJS.DES.decrypt(cipherText, this.key).toString(CryptoJS.enc.Utf8);
  }
}

export class AesEncryption {
  private key;
  private iv;

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt;
    if (key) this.key = CryptoJS.enc.Utf8.parse(key);

    if (iv) this.iv = CryptoJS.enc.Utf8.parse(iv);
  }

  get getOptions() {
    return {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: this.iv,
    };
  }

  encrypt(cipherText: string) {
    return CryptoJS.AES.encrypt(cipherText, this.key, this.getOptions).toString();
  }

  decrypt(cipherText: string) {
    return CryptoJS.AES.decrypt(cipherText, this.key, this.getOptions).toString(CryptoJS.enc.Utf8);
  }
}

export function encryptByBase64(cipherText: string) {
  return CryptoJS.enc.Utf8.parse(cipherText).toString(CryptoJS.enc.Base64);
}

export function decodeByBase64(cipherText: string) {
  return CryptoJS.enc.Base64.parse(cipherText).toString(CryptoJS.enc.Utf8);
}

export function encryptByMd5(password: string) {
  return CryptoJS.MD5(password).toString();
}
