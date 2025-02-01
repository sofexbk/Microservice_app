import { AuthResponse } from "./AuthResponse";
import { LoginRequest } from "./LoginRequest";

export interface AuthContextType {
    user: AuthResponse | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }