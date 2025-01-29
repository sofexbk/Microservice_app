import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext'; // Ajustez l'import en fonction de votre structure

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const { resetPassword, resetPasswordMessage, resetPasswordError, clearMessages } = useAuthContext();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string>(''); // État local pour les messages d'erreur
  const [localMessage, setLocalMessage] = useState<string>(''); // État local pour les messages de succès

  useEffect(() => {
    // Clear messages on component mount
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    // Display messages based on the context
    if (resetPasswordMessage) {
      setLocalMessage(resetPasswordMessage);
      setLocalError(''); // Clear any error message
    }
    if (resetPasswordError) {
      setLocalError(resetPasswordError);
      setLocalMessage(''); // Clear any success message
    }
  }, [resetPasswordMessage, resetPasswordError]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!token) {
      setLocalError('Le jeton est manquant.');
      return;
    }
  
    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas.');
      return;
    }
  
    try {
      await resetPassword(token, password, confirmPassword);
      setLocalError("");
      setLocalMessage('Mot de passe réinitialisé avec succès.');
      // Optionally redirect or do something else after success
           // Rediriger après 3 secondes et rafraîchir immédiatement après
    setTimeout(() => {
      navigate('/auth/signin'); // Rediriger vers la page de connexion
      setTimeout(() => {
        window.location.reload(); // Rafraîchir la page après un délai
      }, 500); // Ajustez le délai selon vos besoins
    }, 2000); // 3 secondes pour afficher le message avant de rediriger
    } catch (err) {
      setLocalMessage(""); // Clear any success message

      if (err instanceof Error) {
        setLocalError(err.message);
      } else if (err && (err as { response?: { data?: { message?: string } } }).response) {
        const errorResponse = err as { response: { data: { message: string } } };
        const errorMessage = errorResponse.response.data.message;

        if (errorMessage === 'Jeton de réinitialisation invalide ou expiré') {
          setLocalError('Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.');
          setTimeout(() => navigate('/forgot-password'), 3000); // Rediriger vers la page de réinitialisation du mot de passe après 3 secondes
        } else {
          setLocalError(errorMessage || 'Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        setLocalError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Réinitialiser le mot de passe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
        {localError && (
          <p className="mt-4 text-red-600 dark:text-red-400">{localError}</p>
        )}
        {localMessage && (
          <p className="mt-4 text-green-600 dark:text-green-400">{localMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
