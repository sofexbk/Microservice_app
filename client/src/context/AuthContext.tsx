import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { UserRegistrationDTO } from '../types/UserRegistrationDTO';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assurez-vous d'importer useNavigate
import { getUserInfoFromToken } from '../pages/security/JwtDecoder';
import Swal from 'sweetalert2';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  register: (user: UserRegistrationDTO) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  loginMessage: string;
  loginError: string;
  registerMessage: string;
  registerError: string;
  forgotPasswordMessage: string;
  forgotPasswordError: string;
  resetPasswordMessage: string;
  resetPasswordError: string;
  clearMessages: () => void;
}


export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  telephone:string;
  structureId?: string;
  structureName?: string;
  blacklisted?: boolean;
}

const initialAuthContext: AuthContextType = {
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: () => false,
  register: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  loginMessage: '',
  loginError: '',
  registerMessage: '',
  registerError: '',
  forgotPasswordMessage: '',
  forgotPasswordError: '',
  resetPasswordMessage: '',
  resetPasswordError: '',
  clearMessages: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [registerMessage, setRegisterMessage] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string>('');
  const [forgotPasswordError, setForgotPasswordError] = useState<string>('');
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string>('');
  const [resetPasswordError, setResetPasswordError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const parsedUser = getUserInfoFromToken(token);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user cookie');
      }
    }
  }, []);

  const clearMessages = () => {
    setLoginMessage('');
    setLoginError('');
    setRegisterMessage('');
    setRegisterError('');
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    setResetPasswordMessage('');
    setResetPasswordError('');
  };

  const forgotPassword = async (email: string) => {
    setForgotPasswordMessage('');
    setForgotPasswordError('');
  
    try {
      const response = await axiosInstance.post('/api/forgot-password', { email });
      setForgotPasswordMessage(response.data.message || 'Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
      setForgotPasswordError(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    // Vérification de l'adresse e-mail
    if (!validateEmail(email)) {
      setLoginError('Adresse e-mail invalide.');
      setLoginMessage('');
      return;
    }
  
    // Vérification du mot de passe
    if (!password) {
      setLoginError('Veuillez entrer votre mot de passe.');
      setLoginMessage('');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/api/login', { email, password });

      const { token } = response.data;
      const user: User = {
        userId: response.data.userId,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role,
        telephone: response.data.telephone,
        structureId: response.data.structureId,
        structureName: response.data.structureName,
        blacklisted: response.data.blacklisted,
      };
  
      // Vérification des données utilisateur
      if (!token  || !user.userId || !user.email || !user.firstName || !user.lastName || !user.role) {
        throw new Error('Les données utilisateur sont manquantes.');
      }
  

      // Configuration des cookies
      Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'Strict', path: '/', httpOnly: false });

      setUser(user);
      setLoginError('');  
      // Gestion de la redirection en fonction du rôle
      if (user.role === "PRESIDENT") {
        navigate('/president/events');
      } else if (user.role === "PARRAIN") {
        navigate('/parrain/evattente');
      } else {
        navigate('/super/eventsAtt');
      }
  
    } catch (error: any) {
      setLoginError(error.response?.data || 'Erreur de connexion. Veuillez réessayer.');
      setLoginMessage('');
    }
  };
  
  

  const logout = () => {
    setUser(null); // Clear user state
    Cookies.remove('authToken'); // Remove authentication token from cookies
    setLoginError(''); // Clear login errors
    window.location.href = '/auth/signin';
  };

  const isAuthenticated = (): boolean => !!user;

  const register = async (user: UserRegistrationDTO) => {
    setRegisterMessage('');
    setRegisterError('');
    try {
      if (user.password !== user.confirmPassword) {
        setRegisterError('Les mots de passe ne correspondent pas.');
        return;
      } 

        // Vérifiez la taille du fichier (si disponible)
        if (user.file && user.file.size > 30 * 1024 * 1024) { // 30 Mo
          setRegisterError('La taille du fichier dépasse la limite autorisée de 30 Mo.');
          return;
        }
        // Préparez les données de l'utilisateur en fonction du rôle et des exigences du backend
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('confirmPassword', user.confirmPassword);
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('telephone', user.telephone);
        formData.append('role', user.role);
        // Ajoutez structureId si requis par le rôle
        if (user.structureId && user.role !== 'SUPER_PARRAIN') {
          formData.append('structureId', user.structureId);
        }

        // Ajoutez le fichier de document pour le rôle PRESIDENT, si disponible
        if (user.role === 'PRESIDENT' && user.file) {
          formData.append('file', user.file);
        }

        const response = await axiosInstance.post('/api/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      setRegisterMessage(response.data.message || 'Inscription réussie.');
      Swal.fire({
        title: 'Succès',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'custom-confirm-button' // Classe personnalisée pour le bouton de confirmation
        }
    });
      setRegisterError('');
      navigate("/auth/signin")
    } catch (erreur: any) {
      if (erreur.response && erreur.response.data) {
        const { error } = erreur.response.data;
        setRegisterError(error);
      } else {
        setRegisterError('Une erreur inattendue est survenue.');
      }
      setRegisterMessage('');
    }
  };




  const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    try {
      await axiosInstance.post('/api/reset-password', {
        newPassword,
        confirmPassword
      }, {
        params: {
          token
        }
      });
      setResetPasswordMessage('Le mot de passe a été réinitialisé avec succès.');
        // Utiliser un setTimeout pour la redirection après un succès
        setTimeout(() => {
          navigate('/auth/signin'); // Rediriger vers la page de connexion après 2 secondes
          setTimeout(() => {
            window.location.reload(); // Rafraîchir la page après un léger délai pour garantir que la redirection se produit
          }, 500); // Délai court après la redirection
        }, 2000);
    
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setResetPasswordError(error.response?.data|| 'Une erreur est survenue. Veuillez réessayer.');
      } else if (error instanceof Error) {
        setResetPasswordError(error.message);
      } else {
        setResetPasswordError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        register,
        forgotPassword,
        resetPassword,
        loginMessage,
        loginError,
        registerMessage,
        registerError,
        forgotPasswordMessage,
        forgotPasswordError,
        resetPasswordMessage,
        resetPasswordError,
        clearMessages        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
