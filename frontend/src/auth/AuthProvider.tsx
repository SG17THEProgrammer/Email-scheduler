import { createContext, useState, useEffect } from "react";
import { type User } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(
  null
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  // Restore login after refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const setAndPersistUser = (u: User | null) => {
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: setAndPersistUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
