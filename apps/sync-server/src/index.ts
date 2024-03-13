import { Logger } from "@hocuspocus/extension-logger";
import { SQLite } from "@hocuspocus/extension-sqlite";
import { Hocuspocus } from "@hocuspocus/server";

import { env } from "./env";

// TODO: share types between server and client
type Issue = {
  id: string;
  storyPoints?: number;
  createdAt: number;
  createdBy: string;
  link?: string;
  title: string;
};

type User = {
  id: string;
  name: string;
};

type Vote = {
  votedBy: User;
  vote: number | string;
};

type RoomState = {
  votes: Vote[];
  currentVotingIssue?: Issue;
  participants: User[];
  revealCards: boolean;
  votingSystem: string;
  name: string;
  counterStartedAt?: number;
  counterEndsAt?: number;
  currentCount?: number;
};

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

    const roomMap = document.getMap<RoomState>(`ui-state${document.name}`);
    const room = roomMap.get(document.name);

    if (!room) {
      // TODO: add observability
      return;
    }

    roomMap.set(document.name, {
      ...room,
      participants: room.participants.filter(
        (participant) => participant.id !== userId,
      ),
    });
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
