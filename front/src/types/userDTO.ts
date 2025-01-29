export interface UserDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    emailVerified: boolean;
    role: string; // ou `Role` si vous avez défini une enum pour les rôles
    telephone:string;
    structure?: {
      id: string;
      name: string;
    };
    documentParrainage?:string
    cne?:string
  }
  