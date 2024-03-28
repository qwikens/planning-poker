import { v4 as uuid } from "uuid";
import {
  GUEST_NAME_KEY,
  PRIVATE_KEY_KEY,
  SYMMETRIC_KEY_KEY,
  USER_ID_KEY,
} from "./env";

/** Creates session and saves user id to local storage. */
export const createSession = () => {
  const id = uuid();
  localStorage.setItem(USER_ID_KEY, id);
  return id;
};

/** Removes user id from local storage. */
export const clearSession = () => {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(GUEST_NAME_KEY);
};

/** Returns user id from local storage. */
export const getSession = () => localStorage.getItem(USER_ID_KEY);

/** Creates a new room id. */
export const createRoom = () => {
  return uuid();
};

/** Returns default guest name. */
export const getGuestName = () => localStorage.getItem(GUEST_NAME_KEY);

/** Saves default guest name. */
export const saveGuestName = (name: string) => {
  localStorage.setItem(GUEST_NAME_KEY, name);
};

/** Saves private key to local storage. */
export const savePrivateKey = (privateKey: string) => {
  localStorage.setItem(PRIVATE_KEY_KEY, privateKey);
};

/** Returns private key from local storage. */
export const getPrivateKey = () => localStorage.getItem(PRIVATE_KEY_KEY);

/** Saves symmetric key to local storage. */
export const saveSymmetricKey = (symmetricKey: string) => {
  localStorage.setItem(SYMMETRIC_KEY_KEY, symmetricKey);
};

/** Returns symmetric key from local storage. */
export const getSymmetricKey = () => localStorage.getItem(SYMMETRIC_KEY_KEY);
