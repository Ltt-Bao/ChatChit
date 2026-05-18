import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import HomePage from "./pages/Homepage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark, setTheme]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [accessToken, connectSocket, disconnectSocket]);

  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/"
            element={
              accessToken ? <Navigate to="/chat" replace /> : <HomePage />
            }
          />

          <Route
            path="/signin"
            element={
              accessToken ? <Navigate to="/chat" replace /> : <SignInPage />
            }
          />

          <Route
            path="/signup"
            element={
              accessToken ? <Navigate to="/chat" replace /> : <SignUpPage />
            }
          />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatAppPage />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
