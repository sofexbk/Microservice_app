export interface AuthResponse {
    token: string;
    userId: string;
    role: Role;
    entityId: string | null;
    email: string;
  }