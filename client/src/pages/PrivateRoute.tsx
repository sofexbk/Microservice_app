import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from './security/JwtDecoder';


interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles?: string[]; // Liste des rôles autorisés pour accéder à la route
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles = [] }) => {
  const location = useLocation();
  const user = getUser(); // Obtenez les informations de l'utilisateur

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = Boolean(user);

  // Vérifier si l'utilisateur a le rôle approprié
  const hasAccess = allowedRoles.length === 0 || (user && allowedRoles.includes(user.role));

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    // Rediriger vers une page de 403 ou 404 si l'utilisateur n'a pas accès
    return <Navigate to="/404" state={{ from: location }} replace />;
  }

  // Rendre l'élément si l'utilisateur est authentifié et a le rôle approprié
  return element;
};

export default PrivateRoute;
