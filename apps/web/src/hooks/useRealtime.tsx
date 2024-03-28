import { createContext, useContext, useEffect, useMemo } from "react";
import { bind } from "valtio-yjs";
import * as Y from "yjs";

import {
  asymmetricDecrypt,
  asymmetricEncrypt,
  symmetricDecrypt,
} from "@/lib/crypto";
import {
  getPrivateKey,
  getSession,
  getSymmetricKey,
  saveSymmetricKey,
} from "@/lib/session";
import {
  Issue,
  User,
  decryptedState,
  issuesState,
  participantsState,
  state,
} from "@/store";
import { HotkeyItem, useHotkeys } from "@mantine/hooks";
import { subscribe } from "valtio";
import { useHocusPocus } from "./useHocuspocus";

type RealtimeProviderProps = {
  children: React.ReactNode;
};

type RealtimeContextType = {
  room: Y.Map<unknown>;
  issues: Y.Array<Issue>;
  participants: Y.Array<User>;
  undoManagerIssues: Y.UndoManager;
};

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined,
);

export const useDocuments = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};

export const RealtimeProvider = ({ children }: RealtimeProviderProps) => {
  const { provider, roomId } = useHocusPocus();
  const room = provider.document.getMap(`game-state-${roomId}`);
  const issues = provider.document.getArray<Issue>(`issues-state-${roomId}`);
  const participants = provider.document.getArray(
    `participants-state-${roomId}`,
  );

  const undoManagerIssues = useMemo(() => new Y.UndoManager(issues), [issues]);

  const decryptIssues = (symmetricKey: string) => {
    decryptedState.decryptedIssues = issuesState.map((encryptedIssue) => {
      const foundDecryptedIssue = decryptedState.decryptedIssues.find(
        (decryptedIssue) => decryptedIssue.id === encryptedIssue.id,
      );

      if (!foundDecryptedIssue) {
        return {
          ...encryptedIssue,
          title: symmetricDecrypt(encryptedIssue.title, symmetricKey),
        };
      }

      return {
        ...encryptedIssue,
        title: foundDecryptedIssue.title,
      };
    });
  };

  useEffect(() => {
    const unbindGame = bind(state, room);
    const unbindIssues = bind(issuesState, issues);
    const unbindParticipants = bind(participantsState, participants);
    const unsubscribeIssues = subscribe(issuesState, () => {
      const symmetricKey = getSymmetricKey();
      if (!symmetricKey) {
        return;
      }

      decryptIssues(symmetricKey);
    });
    const unsubscribeParticipants = subscribe(participantsState, () => {
      const userId = getSession();
      const symmetricKey = getSymmetricKey();
      if (!userId || !symmetricKey) return;

      for (const participant of participantsState) {
        if (
          state.encryptedSymmetricKeys[participant.id] ||
          participant.id === userId
        ) {
          continue;
        }

        const participantPublicKey = state.publicKeys[participant.id];

        if (!participantPublicKey) {
          continue;
        }

        room.set("encryptedSymmetricKeys", {
          ...state.encryptedSymmetricKeys,
          [participant.id]: asymmetricEncrypt(
            symmetricKey,
            participantPublicKey,
          ),
        });
      }
    });
    const unsubscribeEncryptedSymmetricKeys = subscribe(state, () => {
      const userId = getSession();
      const privateKey = getPrivateKey();
      if (!userId || !privateKey) return;

      if (
        !state.hasDecryptedSymmetricKey[userId] &&
        state.encryptedSymmetricKeys[userId]
      ) {
        for (const [participantId, encryptedSymmetricKey] of Object.entries(
          state.encryptedSymmetricKeys,
        )) {
          if (participantId === userId) {
            saveSymmetricKey(
              asymmetricDecrypt(encryptedSymmetricKey, privateKey),
            );
            room.set("hasDecryptedSymmetricKey", {
              ...state.hasDecryptedSymmetricKey,
              [userId]: true,
            });
          }
        }
      }
    });

    return () => {
      unbindGame();
      unbindIssues();
      unbindParticipants();
      unsubscribeIssues();
      unsubscribeParticipants();
      unsubscribeEncryptedSymmetricKeys();
    };
  }, [room, issues, participants, decryptIssues]);

  const handleHotkey = (shortcut: string): HotkeyItem => {
    return [
      shortcut,
      (event: KeyboardEvent) => {
        event.preventDefault();
        undoManagerIssues.undo();

        if (process.env.NODE_ENV === "development") {
          console.log(`Shortcut executed: ${shortcut}`);
        }
      },
    ];
  };

  useHotkeys(
    [
      handleHotkey("mod+z"),

      [
        "shift+mod+z",
        (event) => {
          event.preventDefault();
          undoManagerIssues.redo();
        },
      ],
    ],
    [],
  );

  return (
    <RealtimeContext.Provider
      value={{
        room,
        participants,
        issues,
        undoManagerIssues,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};
