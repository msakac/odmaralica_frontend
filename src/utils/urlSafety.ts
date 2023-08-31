/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
import { AES, enc } from 'crypto-js';

// Basic encryption and decryption functions
const key = 'UuFPTWvK6c4Omwd3xcdgPAq5EyOFCOEK';
const encryptData = (data: string) => {
  const cipherText = AES.encrypt(data.toString(), key);
  return cipherText.toString();
};

function decryptData(data: string) {
  const bytes = AES.decrypt(data, key);
  const decrypted = bytes.toString(enc.Utf8);
  return decrypted;
}

export { encryptData, decryptData };
