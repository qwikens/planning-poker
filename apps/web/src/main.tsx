import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { CreateRoomForm } from "@/features/CreateGameForm.tsx";
import { Room } from "@/game.tsx";
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
		element: <Room />,
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
