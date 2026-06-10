import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Playground } from "./playground";
import "./styles.css";

const root = document.querySelector("#root");

if (!(root instanceof HTMLElement)) {
  throw new Error("Playground root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
