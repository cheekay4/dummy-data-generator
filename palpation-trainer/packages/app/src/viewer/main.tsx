import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./style.css";

const el = document.getElementById("root");
if (el === null) throw new Error("#root が見つかりません");
createRoot(el).render(<App />);
