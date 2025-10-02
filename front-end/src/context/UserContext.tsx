import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/User";
import type { UserContextType } from "../types/User";
import { CheckAuth } from "../utils/check-auth-user";

//Precisa passar os valores iniciais para criar o contexto
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const check = async () => {
      const data = await CheckAuth();

      if (!data.status) {
        setUser(null);
        return;
      }
      setUser(data.user);
    };
    check();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
