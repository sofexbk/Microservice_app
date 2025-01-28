import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import {  CircularProgress,  TextField, Typography } from '@mui/material';
import { getUser } from '../security/JwtDecoder';


const SignIn: React.FC = () => {
  const { login, loginError, loginMessage, user,clearMessages } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string>(''); // Local state for error
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  useEffect(() => {
    // Clear messages on component mount
    clearMessages();
  }, []);

  useEffect(() => {
    const user = getUser();
    if (user) { // Vérifiez si user n'est pas null ou undefined
      if (user.role == 'PRESIDENT') {
        navigate('/president/events'); // Redirection pour le rôle PRESIDENT
      } else if (user.role == 'PARRAIN') {
        navigate('/parrain/evattente'); // Redirection pour le rôle PARRAIN
      } else if (user.role == 'SUPER_PARRAIN'){
        navigate('/super/eventsAtt'); // Redirection par défaut
      }
    }
  },  [navigate,user]); // Ne pas inclure `user` dans les dépendances ici


  useEffect(() => {
    // Clear messages on component mount
    clearMessages();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLocalError(''); // Clear previous local error

    // Validation des champs
    let hasError = false;
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Veuillez entrer votre adresse e-mail.' }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'L\'adresse e-mail n\'est pas valide.' }));
      hasError = true;
    }

    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: 'Veuillez entrer votre mot de passe.' }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await login(email, password);



      setLocalError('');
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        setLocalError(data.message );
      } else {
        setLocalError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 ">
      <div className="w-full max-w-lg p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-16 mt-16"> {/* Agrandir la largeur et le padding */}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Se connecter
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: '' }));
              setLocalError('');
            }}
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              style: { fontSize: '1.1rem' }, // Augmenter la taille du texte
            }}
          />
          <TextField
            label="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: '' }));
              setLocalError('');
            }}
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              style: { fontSize: '1.1rem' }, // Augmenter la taille du texte
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary py-4 text-lg font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
          >
            {loading ? (
              <CircularProgress size={30} color="inherit" />
            ) : (
              'Se connecter'
            )}
          </button>
          <div className="mt-6 text-center">
            {localError || loginError ? (
              <div className="mb-4 text-red-500">
                {localError || loginError}
              </div>
            ) : null}
            <p className="text-base font-medium text-body-color dark:text-white">
              Vous n'avez pas de compte ?{' '}
              <Link
                to="/auth/signup"
                className="text-primary underline hover:no-underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
          {loginMessage && (
            <Typography color="success.main" align="center">
              {loginMessage}
            </Typography>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;