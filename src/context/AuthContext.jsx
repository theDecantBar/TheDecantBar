import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("tdb_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("tdb_token") || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Validate or synchronize user profile on startup if token exists
  useEffect(() => {
    async function verifySession() {
      const savedToken = localStorage.getItem("tdb_token");
      if (savedToken) {
        try {
          const res = await getProfile(savedToken);
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem("tdb_user", JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn("Session expired or invalid, logging out:", err.message);
          logout();
        }
      }
      setIsLoading(false);
    }

    verifySession();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("tdb_token", data.token);
    localStorage.setItem("tdb_user", JSON.stringify(data.user));
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("tdb_token", data.token);
    localStorage.setItem("tdb_user", JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("tdb_token");
    localStorage.removeItem("tdb_user");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("tdb_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: Boolean(user?.isAdmin),
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
