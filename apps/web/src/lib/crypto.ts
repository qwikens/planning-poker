import forge from "node-forge";

/**
 * Generates a RSA key pair using a specified bit length.
 * @returns An object containing the PEM encoded public and private keys.
 * @example
 * const keyPair = generateKeyPair();
 * console.log(keyPair.publicKey); // PEM encoded public key
 * console.log(keyPair.privateKey); // PEM encoded private key
 */
export const generateKeyPair = () => {
  const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  return {
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
  };
};

/**
 * Encrypts a message using a given public key.
 * @param message - The plaintext message to be encrypted.
 * @param publicKey - The PEM encoded public key used for encryption.
 * @returns The encrypted message, base64 encoded.
 * @example
 * const encryptedMessage = encryptMessage("Hello, world!", publicKey);
 * console.log(encryptedMessage); // Encrypted and base64 encoded message
 */
export const encryptMessage = (message: string, publicKey: string) => {
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
 * const decryptedMessage = decryptMessage(encryptedMessage, privateKey);
 * console.log(decryptedMessage); // Decrypted plaintext message
 */
export const decryptMessage = (
  encryptedMessage: string,
  privateKey: string,
) => {
  const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
  const encrypted = forge.util.decode64(encryptedMessage);
  const decrypted = privateKeyObj.decrypt(encrypted);
  return forge.util.decodeUtf8(decrypted);
};
