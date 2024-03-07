import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { App, CreateRoomForm, Room } from "./App";
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
