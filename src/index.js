import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/DarkMode.css';
import './components/RTL.css';
import App from "./App";
import { ThemeProvider }    from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider }     from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // ThemeProvider must wrap AuthProvider so AuthContext can call useTheme()
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);
