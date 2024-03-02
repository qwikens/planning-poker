import { Logger } from "@hocuspocus/extension-logger";
import { SQLite } from "@hocuspocus/extension-sqlite";
import { Hocuspocus } from "@hocuspocus/server";

import { env } from "./env";

export const server = new Hocuspocus({
	port: env.PORT,
	extensions: [
		new SQLite({
			database: env.DATABASE_PATH,
		}),
		new Logger(),
	],
});

server.listen();
