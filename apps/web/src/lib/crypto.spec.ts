import { decryptMessage, encryptMessage, generateKeyPair } from "./crypto";

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
  const encryptedMessage = encryptMessage(message, publicKey);
  const decryptedMessage = decryptMessage(encryptedMessage, privateKey);

  expect(encryptedMessage).not.toEqual(message);
  expect(decryptedMessage).toEqual(message);
});
