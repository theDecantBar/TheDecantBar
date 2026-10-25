import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile, googleAuthApi } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("tdb_user");
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      if (parsed) {
        parsed.isAdmin = Boolean(
          parsed.isAdmin ||
          parsed.is_admin ||
          parsed.email?.toLowerCase() === "thedecantbarofficial@gmail.com"
        );
      }
      return parsed;
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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("tdb_token");
    localStorage.removeItem("tdb_user");
  };

  // Validate or synchronize user profile on startup if token exists
  useEffect(() => {
    async function verifySession() {
      const savedToken = localStorage.getItem("tdb_token");
      if (savedToken) {
        try {
          const res = await getProfile(savedToken);
          if (res?.user) {
            const userObj = {
              ...res.user,
              isAdmin: Boolean(
                res.user.isAdmin ||
                res.user.is_admin ||
                res.user.email?.toLowerCase() === "thedecantbarofficial@gmail.com"
              ),
            };
            setUser(userObj);
            localStorage.setItem("tdb_user", JSON.stringify(userObj));
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

  const loginWithToken = (userData, userToken) => {
    const userObj = {
      ...userData,
      isAdmin: Boolean(
        userData.isAdmin ||
        userData.is_admin ||
        userData.email?.toLowerCase() === "thedecantbarofficial@gmail.com"
      ),
    };
    setUser(userObj);
    setToken(userToken);
    localStorage.setItem("tdb_token", userToken);
    localStorage.setItem("tdb_user", JSON.stringify(userObj));
    return userObj;
  };

  const loginWithGoogle = async (payload) => {
    const authResult = await googleAuthApi(payload);
    loginWithToken(authResult.user, authResult.token);
    return authResult;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const userObj = {
      ...data.user,
      isAdmin: Boolean(
        data.user.isAdmin ||
        data.user.is_admin ||
        data.user.email?.toLowerCase() === "thedecantbarofficial@gmail.com"
      ),
    };
    setUser(userObj);
    setToken(data.token);
    localStorage.setItem("tdb_token", data.token);
    localStorage.setItem("tdb_user", JSON.stringify(userObj));
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
        isLoading,
        login,
        loginWithToken,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
