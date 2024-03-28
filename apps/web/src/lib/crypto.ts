import forge from "node-forge";

/**
 * Generates a RSA key pair using a specified bit length.
 * @returns An object containing the PEM encoded public and private keys.
 * @example
 * const keyPair = generateKeyPair();
 * console.log(keyPair.publicKey); // PEM encoded public key
 * console.log(keyPair.privateKey); // PEM encoded private key
 */
export const generateKeyPair = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> =>
  new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048 }, (err, keys) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
      });
    });
  });

/**
 * Encrypts a message using a given public key.
 * @param message - The plaintext message to be encrypted.
 * @param publicKey - The PEM encoded public key used for encryption.
 * @returns The encrypted message, base64 encoded.
 * @example
 * const encryptedMessage = asymmetricEncrypt("Hello, world!", publicKey);
 * console.log(encryptedMessage); // Encrypted and base64 encoded message
 */
export const asymmetricEncrypt = (message: string, publicKey: string) => {
  const publicKeyRsa = forge.pki.publicKeyFromPem(publicKey);
  const encrypted = publicKeyRsa.encrypt(forge.util.encodeUtf8(message));
  return forge.util.encode64(encrypted);
};

/**
 * Decrypts an encrypted message using a given private key.
 * @param encryptedMessage - The encrypted message, base64 encoded.
 * @param privateKey - The PEM encoded private key used for decryption.
 * @returns The decrypted plaintext message.
 * @example
 * const decryptedMessage = asymmetricDecrypt(encryptedMessage, privateKey);
 * console.log(decryptedMessage); // Decrypted plaintext message
 */
export const asymmetricDecrypt = (
  encryptedMessage: string,
  privateKey: string,
) => {
  const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
  const encrypted = forge.util.decode64(encryptedMessage);
  const decrypted = privateKeyObj.decrypt(encrypted);
  return forge.util.decodeUtf8(decrypted);
};

/**
 * Generates a symmetric key using a specified bit length.
 * @param {number} [bitLength=256] - The bit length for the symmetric key. Default is 256 bits.
 * @returns {string} The generated symmetric key, base64 encoded.
 * @example
 * const symmetricKey = generateSymmetricKey();
 * console.log(symmetricKey); // Base64 encoded symmetric key
 */
export const generateSymmetricKey = (bitLength = 256) => {
  const bytes = bitLength / 8;
  const key = forge.random.getBytesSync(bytes);
  return forge.util.encode64(key);
};

/**
 * Encrypts a message using a symmetric key.
 * @param message - The plaintext message to be encrypted.
 * @param symmetricKey - The base64 encoded symmetric key used for encryption.
 * @returns The encrypted message, base64 encoded.
 * @example
 * const encryptedMessage = symmetricEncrypt("Hello, world!", symmetricKey);
 * console.log(encryptedMessage); // Encrypted and base64 encoded message
 */
export const symmetricEncrypt = (message: string, symmetricKey: string) => {
  const key = forge.util.decode64(symmetricKey);
  const iv = forge.random.getBytesSync(16); // Initialization vector
  const cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(message)));
  cipher.finish();
  const encrypted = cipher.output.getBytes();
  const encryptedMessageWithIv = `${iv}${encrypted}`;
  return forge.util.encode64(encryptedMessageWithIv);
};

/**
 * Decrypts an encrypted message using a symmetric key.
 * @param encryptedMessage - The encrypted message, base64 encoded.
 * @param symmetricKey - The base64 encoded symmetric key used for decryption.
 * @returns The decrypted plaintext message.
 * @example
 * const decryptedMessage = symmetricDecrypt(encryptedMessage, symmetricKey);
 * console.log(decryptedMessage); // Decrypted plaintext message
 */
export const symmetricDecrypt = (
  encryptedMessage: string,
  symmetricKey: string,
) => {
  const key = forge.util.decode64(symmetricKey);
  const encryptedBytesWithIv = forge.util.decode64(encryptedMessage);
  const iv = encryptedBytesWithIv.slice(0, 16);
  const encryptedBytes = encryptedBytesWithIv.slice(16);
  const decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(encryptedBytes));
  decipher.finish();
  return forge.util.decodeUtf8(decipher.output.getBytes());
};
