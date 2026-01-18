import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/useAuth";
import MailViewer from "./components/email/MailViewer";

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
      <Route path="/viewMail/:id" element={<MailViewer />} />
    </Routes>
  );
}
