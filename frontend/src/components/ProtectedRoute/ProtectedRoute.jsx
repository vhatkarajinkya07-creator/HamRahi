import { Navigate, useLocation } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050505] pt-[84px] text-white">
        <ProgressSpinner strokeWidth="4" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
