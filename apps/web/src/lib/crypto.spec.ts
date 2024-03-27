import {
  asymmetricDecrypt,
  asymmetricEncrypt,
  generateKeyPair,
  generateSymmetricKey,
  symmetricDecrypt,
  symmetricEncrypt,
} from "./crypto";

it("generates a key pair", () => {
  const { publicKey, privateKey } = generateKeyPair();

  expect(publicKey).toContain("-----BEGIN PUBLIC KEY-----");
  expect(publicKey).toContain("-----END PUBLIC KEY-----");
  expect(privateKey).toContain("-----BEGIN RSA PRIVATE KEY-----");
  expect(privateKey).toContain("-----END RSA PRIVATE KEY-----");
});

it("encrypts and decrypts a message correctly", () => {
  const { publicKey, privateKey } = generateKeyPair();
  const message = "Hello, world!";
  const encryptedMessage = asymmetricEncrypt(message, publicKey);
  const decryptedMessage = asymmetricDecrypt(encryptedMessage, privateKey);

  expect(encryptedMessage).not.toEqual(message);
  expect(decryptedMessage).toEqual(message);
});

it("encrypts and decrypts a message using a symmetric key", () => {
  const symmetricKey = generateSymmetricKey();
  const message = "Hello, world!";
  const encryptedMessage = symmetricEncrypt(message, symmetricKey);
  const decryptedMessage = symmetricDecrypt(encryptedMessage, symmetricKey);

  expect(encryptedMessage).not.toEqual(message);
  expect(decryptedMessage).toEqual(message);
});
