import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { CreateRoomForm } from "@/features/create-game-form.tsx";
import { Game } from "@/game.tsx";
import { App } from "./App";
import "./global.css";
import { ThemeProvider } from "@/hooks/theme-provider.tsx";

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
