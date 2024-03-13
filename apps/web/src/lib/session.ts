import * as crypto from "crypto";
import { GUEST_NAME_KEY, USER_ID_KEY } from "./env";

/** Creates session and saves user id to local storage. */
export const createSession = () => {
	let id: string;

	// some browsers don't support crypto.randomUUID without HTTPS
	if (typeof crypto.randomUUID === "function") {
		id = crypto.randomUUID();
	} else {
		id = Math.random().toString(36).substring(2);
	}

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
	let id: string;

	// some browsers don't support crypto.randomUUID without HTTPS
	if (typeof crypto.randomUUID === "function") {
		id = crypto.randomUUID();
	} else {
		id = Math.random().toString(36).substring(2);
	}

	return id;
};

/** Returns default guest name. */
export const getGuestName = () => localStorage.getItem(GUEST_NAME_KEY);

/** Saves default guest name. */
export const saveGuestName = (name: string) => {
	localStorage.setItem(GUEST_NAME_KEY, name);
};
