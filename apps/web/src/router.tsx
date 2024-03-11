import { createBrowserRouter } from "react-router-dom";
import { App, CreateRoomForm } from "./App";

// TODO: Convert all to lazy
export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/:id",
		lazy: () => import("./features/room"),
	},
	{
		path: "new-game",
		element: <CreateRoomForm />,
	},
]);
