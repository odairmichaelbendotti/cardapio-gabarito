export interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
}

export type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
