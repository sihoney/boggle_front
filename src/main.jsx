import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// strict mode 잠시 끄기
createRoot(document.getElementById("root")).render(<App />);
