// src/components/ForgotPassword.tsx
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const [localMessage, setLocalMessage] = useState<string>('');
  const { forgotPassword, forgotPasswordMessage, forgotPasswordError,clearMessages } = useAuthContext();

  useEffect(() => {
    // Clear messages on component mount
    clearMessages();
  }, []);

  useEffect(() => {
    if (forgotPasswordMessage) {
      setLocalMessage(forgotPasswordMessage);
    }
    if (forgotPasswordError) {
      setLocalError(forgotPasswordError);
    }
  }, [forgotPasswordMessage, forgotPasswordError]);
  
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email.trim()) {
      setLocalError('L\'adresse e-mail ne peut pas être vide.');
      return;
    }
  
    if (!validateEmail(email)) {
      setLocalError('L\'adresse e-mail n\'est pas valide.');
      return;
    }
  
    if (isSubmitting) {
      setLocalError('Une demande est déjà en cours. Veuillez attendre.');
      return;
    }
  
    setLocalError('');
    setLocalMessage('');
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setLocalMessage(forgotPasswordMessage);
      setLocalError(''); // Clear error on successful request
    } catch (err: any) {
      setLocalError(forgotPasswordError || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
      // Optionally clear the message here as well if you need to reset state
      setLocalMessage('');
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLocalMessage('');
    setLocalError('');
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
          Mot de Passe Oublié
        </h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              placeholder="Entrez votre e-mail"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 ${isSubmitting ? 'bg-gray-400' : 'bg-primary'} text-white rounded-lg hover:bg-opacity-90 transition`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </button>
          {localMessage && (
            <p className="mt-4 text-center text-green-500">
              {localMessage}
            </p>
          )}
          {localError && (
            <p className="mt-4 text-center text-red-500">
              {localError}
            </p>
          )}
        </form>
        <Link to="/auth/signin"
          className="text-center text-primary underline hover:no-underline"
        >
          Revenir vers la page de connexion
        </Link>
      </div>
    </div>
  );
};
export default ForgotPassword;
