import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./global.css";
import { router } from "./router";

createRoot(document.getElementById("root") ?? document.body).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
