import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/hooks/theme-provider.tsx";
import "./global.css";
import { router } from "./router";

createRoot(document.getElementById("root") ?? document.body).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={"dark"}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
