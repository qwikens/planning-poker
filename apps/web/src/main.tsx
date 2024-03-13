import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { HistoryTable } from "@/components/ui/history-table.tsx";
import { CreateRoomForm } from "@/features/create-game-form.tsx";
import { Game } from "@/game.tsx";
import { ThemeProvider } from "@/hooks/theme-provider.tsx";
import { App } from "./App";
import "./global.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [],
	},
	{
		path: "/:id",
		element: <Game />,
	},

	{
		path: "/:id/history",
		element: <HistoryTable />,
	},
	{
		path: "new-game",
		element: <CreateRoomForm />,
	},
]);

createRoot(document.getElementById("root") ?? document.body).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme={"dark"}>
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>,
);
