import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or your full-screen loader
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}