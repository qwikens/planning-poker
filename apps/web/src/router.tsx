import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./App"),
  },
  {
    path: "/:id",
    lazy: () => import("./features/game/game"),
  },
  {
    path: "/:id/history",
    lazy: () => import("./features/history-table"),
  },
  {
    path: "new-game",
    lazy: () => import("./features/create-game-form"),
  },
]);
