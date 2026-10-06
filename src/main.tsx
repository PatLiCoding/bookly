import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-provider";
import { CartProvider } from "./context/cart-provider";
import "./index.css";
import App from "./App";

/**
 * Entry point of the React application.
 * Initializes the React DOM root, mounts React StrictMode, sets up client-side routing
 * with `BrowserRouter` (using Vite's base URL), and wraps the application with authentication
 * and shopping cart context providers.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
