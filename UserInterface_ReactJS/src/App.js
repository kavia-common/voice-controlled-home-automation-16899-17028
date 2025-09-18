import React, { useEffect, useState } from "react";
import "./App.css";
import { Navbar, Button } from "./components/UI";
import DeviceConfigurationPage from "./pages/DeviceConfigurationPage";
import ManualControlPage from "./pages/ManualControlPage";
import DeviceStatusPage from "./pages/DeviceStatusPage";

// PUBLIC_INTERFACE
function App() {
  /**
   * Root app with simple state-based navigation to keep deps minimal.
   * Pages:
   * - config: DeviceConfigurationPage
   * - control: ManualControlPage
   * - status: DeviceStatusPage
   */
  const [theme, setTheme] = useState("light");
  const [route, setRoute] = useState("config");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const renderPage = () => {
    switch (route) {
      case "config":
        return <DeviceConfigurationPage />;
      case "control":
        return <ManualControlPage />;
      case "status":
        return <DeviceStatusPage />;
      default:
        return <DeviceConfigurationPage />;
    }
  };

  return (
    <div className="App">
      <Navbar current={route} onNavigate={setRoute} />
      {renderPage()}
      <Button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </Button>
    </div>
  );
}

export default App;
