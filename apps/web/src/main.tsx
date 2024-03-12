import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Game } from "@/game.tsx";
import { App } from "./App";
import "./global.css";
import { CreateRoomForm } from "@/features/create-game-form.tsx";

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
		<RouterProvider router={router} />
	</React.StrictMode>,
);
