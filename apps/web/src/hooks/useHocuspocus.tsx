import { HocuspocusProvider } from "@hocuspocus/provider";
import { createContext, useContext, useState } from "react";
import { type Doc } from "yjs";

import { createSession, getSession } from "@/lib/session";
import { WS_URL } from "../lib/env";

type HocusPocusProviderProps = {
	children: React.ReactNode;
	roomId: string;
	ydoc: Doc;
};

type HocusPocusContextType = {
	provider: HocuspocusProvider;
	roomId: string;
	canShow: boolean;
	clientId?: number;
};

const HocusPocusContext = createContext<HocusPocusContextType | undefined>(
	undefined,
);

export const useHocusPocus = () => {
	const context = useContext(HocusPocusContext);
	if (!context) {
		throw new Error("useHocusPocus must be used within a HocusPocusProvider");
	}
	return context;
};

export const HocusPocusProvider: React.FC<HocusPocusProviderProps> = ({
	children,
	roomId,
	ydoc,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const provider = new HocuspocusProvider({
		url: WS_URL,
		name: roomId,
		document: ydoc,
		onSynced: () => setIsLoading(true),
		token: () => getSession() ?? createSession(),
		parameters: {
			roomId,
		},
	});

	const clientId = provider.awareness?.clientID;

	return (
		<HocusPocusContext.Provider
			value={{
				provider,
				roomId,
				canShow: isLoading,
				clientId,
			}}
		>
			{children}
		</HocusPocusContext.Provider>
	);
};
