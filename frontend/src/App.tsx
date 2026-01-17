import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/useAuth";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
