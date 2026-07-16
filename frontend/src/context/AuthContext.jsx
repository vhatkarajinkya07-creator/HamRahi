import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationSession, setRegistrationSession] = useState("");

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload) => {
    await api.post("/auth/login", payload);
    return refreshUser();
  };

  const register = async (payload) => {
    const {data} = await api.post("/auth/register", payload);
    setRegistrationSession(data.registrationSession);
    return data;
  };

  const finalizeRegistration = async (session = registrationSession) => {
    await api.post("/auth/finalise-registration", { registrationSession: session });
    setRegistrationSession("");
    return refreshUser();
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const googleLogin = async (credential) => {
    await api.post("/auth/google-login", { credential });
    return refreshUser();
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      registrationSession,
      setRegistrationSession,
      login,
      register,
      finalizeRegistration,
      logout,
      googleLogin,
      refreshUser,
    }),
    [user, loading, registrationSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
