import jwt from 'jsonwebtoken';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const getUserInfoFromToken = (token: string): UserInfo => {
  try {
    const decoded = jwt.decode(token) as { [key: string]: any };
    
    if (!decoded) {
      throw new Error("Token invalide ou mal formé");
    }

    return {
      firstName: decoded.firstName || "",
      lastName: decoded.lastName || "",
      email: decoded.email || "",
      role: decoded.role || "",
    };
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return { firstName: "", lastName: "", email: "", role: "" };
  }
};
