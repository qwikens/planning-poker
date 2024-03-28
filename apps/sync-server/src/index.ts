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
  async onDisconnect(data) {
    const { document } = data;
    const { userId } = data.context;

    const participants = document.getArray<{ id: string }>(
      `participants-state-${document.name}`,
    );

    const participantIndex = participants
      .toArray()
      .findIndex((participant) => participant.id === userId);

    if (participantIndex === -1) {
      return;
    }

    participants.delete(participantIndex, 1);
  },
  async onAuthenticate(data) {
    const { token } = data;

    if (!token) {
      throw new Error("User must be identified");
    }

    return {
      userId: token,
    };
  },
});

server.listen();
