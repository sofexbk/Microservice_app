import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Nom du cookie où le jeton JWT est stocké
const TOKEN_COOKIE_NAME = 'authToken';


// Fonction pour récupérer le jeton JWT depuis les cookies
export const getTokenFromCookies = (): string | null => {
  return Cookies.get(TOKEN_COOKIE_NAME) || null;
};

// Définir une interface pour les attributs spécifiques de l'utilisateur
interface Utilisateur {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  role: string;
  telephone: string;
  structure?: {
    id: number;
    name: string;
    type: string;
  };
  documentParrainage?: string;
  blacklisted?: boolean;
}

// Définir l'interface User pour le type attendu
export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  role: string;
  telephone: string;
  structure?: {
    id: number;
    name: string;
    type: string;
  };
  documentParrainage?: string;
  blacklisted?: boolean;
}

// Fonction pour décoder un jeton JWT et extraire les attributs de l'utilisateur
export const getUserInfoFromToken = (token: string): User => {
  try {
    const decodedToken: { user: Utilisateur } = jwtDecode(token);

    const { id, email, firstName, lastName, enabled, emailVerified, role, telephone, structure, documentParrainage, blacklisted } = decodedToken.user;

    return {
      userId: id,
      email,
      firstName,
      lastName,
      enabled,
      emailVerified,
      role,
      telephone,
      structure,
      documentParrainage,
      blacklisted
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return {
      userId: 0,
      email: "",
      firstName: "",
      lastName: "",
      enabled: false,
      emailVerified: false,
      role: "",
      telephone: "",
      structure: undefined,
      documentParrainage: "",
      blacklisted: false
    };
  }
};

// Fonction pour obtenir l'ID utilisateur à partir du token
export const getUserIdFromToken = (): number | null => {
  const token = getTokenFromCookies();
  if (token) {
    const user = getUserInfoFromToken(token);
    return user.userId || null;
  }
  return null;
};

// Fonction pour obtenir toutes les informations utilisateur à partir du token
export const getUser = (): User | null => {
  const token = getTokenFromCookies();
  if (token) {
    try {
      return getUserInfoFromToken(token);
    } catch (error) {
      console.error("Error getting user from token:", error);
      return null;
    }
  }
  return null;
};
