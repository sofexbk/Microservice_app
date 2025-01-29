export interface UserRegistrationDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword:string;
    telephone:string;
    role:string;
    file?: File | null; // Adjusted type
    structureId?:string;
  }