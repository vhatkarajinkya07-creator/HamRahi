//don't copy paste anything here -AJINKYA



import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ScrollToTop />
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AppShell />
        </GoogleOAuthProvider>
      ) : (
        <AppShell />
      )}
    </BrowserRouter>
  );
}
