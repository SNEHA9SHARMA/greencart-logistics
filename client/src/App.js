import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import RoutesPage from "./pages/Routes";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.id,
          username: payload.username,
          role: payload.role || "manager",
        });
      } catch (err) {
        console.error("Invalid token", err);
        setToken(null);
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  // if not logged in → show login
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <>
      {/* Show navbar only after login */}
      <Navbar setToken={setToken} />

      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Protected */}
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/simulation" element={<Simulation token={token} />} />

        {/* Manager-only */}
        <Route
          path="/drivers"
          element={
            user?.role === "manager" ? (
              <Drivers token={token} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/orders"
          element={
            user?.role === "manager" ? (
              <Orders token={token} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/routes"
          element={
            user?.role === "manager" ? (
              <RoutesPage token={token} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}
