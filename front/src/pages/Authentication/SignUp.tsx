import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserRegistrationDTO } from '../../types/UserRegistrationDTO';
import { useAuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
import Ensa from '../../../public/Ensat.jpg';
import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';
import { getUser } from '../security/JwtDecoder';
import {  useNavigate } from 'react-router-dom';


export const ROLES = {
  PRESIDENT: 'PRESIDENT',
  PARRAIN: 'PARRAIN'
};



export const getStructures = async () => {
  try {
    const response = await axiosInstance.get('/api/structures/np');
    return response.data;
  } catch (error) {
    throw error;
  }
};
const SignUp: React.FC = () => {
  const { register, registerError, registerMessage,user, clearMessages } = useAuthContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [structureId, setStructureId] = useState('');
  const [telephone, setTelephone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [localError, setLocalError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [structures, setStructures] = useState<{ id: number; name: string }[]>([]);
  const navigate = useNavigate();


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
  }, [clearMessages]);

  useEffect(() => {
    if (registerMessage) {
      setLocalError("");
      setSuccessMessage(registerMessage);
    }
    if (registerError) {
      setSuccessMessage("");
      setLocalError(registerError);
    }
  }, [registerMessage, registerError]);

  useEffect(() => {
    // Fetch structures
    const fetchStructures = async () => {
      try {
        const data = await getStructures();
        setStructures(data);
      } catch (error) {
        console.error('Erreur lors du chargement des structures');
      }
    };
    fetchStructures();
  }, []);

  // Fonctions de validation
  const validateEmail = (email: string) => {
    const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return emailPattern.test(email) ? '' : 'L\'adresse e-mail n\'est pas valide';
  };

  const validatePassword = (password: string) => {
    return password ? '' : 'Le mot de passe est requis';
  };

  const validateFirstName = (firstName: string) => {
    return firstName ? '' : 'Le prénom est requis';
  };

  const validateLastName = (lastName: string) => {
    return lastName ? '' : 'Le nom est requis';
  };

  const validateStructureId = (structureId: string) => {
    return structureId ? '' : 'La structure est requise';
  };

  const validateRole = (role: string) => {
    return role ? '' : 'Le rôle est requis';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword ? '' : 'Les mots de passe ne correspondent pas';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Cast e.target to HTMLInputElement to access files property
    const target = e.target as HTMLInputElement;
  
    switch (name) {
      case 'firstName':
        setFirstName(value);
        setErrors(prevErrors => ({ ...prevErrors, firstName: validateFirstName(value) }));
        break;
      case 'lastName':
        setLastName(value);
        setErrors(prevErrors => ({ ...prevErrors, lastName: validateLastName(value) }));
        break;
      case 'email':
        setEmail(value);
        setErrors(prevErrors => ({ ...prevErrors, email: validateEmail(value) }));
        break;
      case 'password':
        setPassword(value);
        setErrors(prevErrors => ({ ...prevErrors, password: validatePassword(value) }));
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: validateConfirmPassword(password, value) }));
        break;
      case 'role':
        setRole(value);
        setErrors(prevErrors => ({ ...prevErrors, role: validateRole(value) }));
        break;
      case 'structureId':
        setStructureId(value);
        setErrors(prevErrors => ({ ...prevErrors, structureId: validateStructureId(value) }));
        break;
      case 'telephone':
        setTelephone(value);
        break;
      case 'documentFile':
        if (target.files && target.files.length > 0) {
          setFile(target.files[0]);
        } else {
          setFile(null);
        }
        break;
      default:
        break;
    }
  };
  
  

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    switch (name) {
      case 'firstName':
        setErrors(prevErrors => ({ ...prevErrors, firstName: validateFirstName(value) }));
        break;
      case 'lastName':
        setErrors(prevErrors => ({ ...prevErrors, lastName: validateLastName(value) }));
        break;
      case 'email':
        setErrors(prevErrors => ({ ...prevErrors, email: validateEmail(value) }));
        break;
      case 'password':
        setErrors(prevErrors => ({ ...prevErrors, password: validatePassword(value) }));
        break;
      case 'confirmPassword':
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: validateConfirmPassword(password, value) }));
        break;
      case 'role':
        setErrors(prevErrors => ({ ...prevErrors, role: validateRole(value) }));
        break;
      case 'structureId':
        setErrors(prevErrors => ({ ...prevErrors, structureId: validateStructureId(value) }));
        break;
    }
  };
  

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Réinitialiser les erreurs précédentes
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
    setLocalError('');
  
    // Validation de base pour les champs requis
    if (!email || !password || !firstName || !lastName || !role) {
      setLocalError('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas.');
      return;
    }
  
     // Afficher une boîte de confirmation avant de soumettre le formulaire
  await Swal.fire({
    title: 'Confirmation',
    text: 'Êtes-vous sûr de vouloir vous inscrire avec ces informations ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler',
    customClass: {
      container: 'custom-swal-container',
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm-button',
      cancelButton: 'custom-swal-cancel-button'
    }
  }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const user: UserRegistrationDTO = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            telephone,
            role,
            file,
            structureId,
          };
          await register(user);
        } catch (error: any) {
          if (error.response && error.response.data) {
            const apiErrors = error.response.data;
            setErrors(apiErrors); // Définir les erreurs en fonction de la réponse de l'API
          } else {
            setErrorMessage('L\'inscription a échoué. Veuillez réessayer.'); // Erreur serveur de secours
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center mb-6 md:mb-0">
          <img
            className="h-48"
            src={Ensa}
            alt="Logo"
          />
          <p className="mt-2 text-center">ENSAT EVENT</p>
        </div>
          <div className="w-full md:w-1/2">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">S'inscrire</h2>
            </div>
            <form onSubmit={handleSignUp}>
            <div className="space-y-4">
              {/* Prénom et Nom côte à côte */}
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5 col-span-1">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="firstName"
                  >
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                </div>
                
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="lastName"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Votre nom"
                    value={lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="email"
                  >
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Votre adresse e-mail"
                    value={email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="role"
                  >
                    Rôle
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  >
                    <option value="">Sélectionner un rôle</option>
                    {Object.entries(ROLES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                  {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
                </div>
                {(role === ROLES.PARRAIN || role === ROLES.PRESIDENT) && (
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="structureId"
                  >
                    Structure
                  </label>
                  <select
                    id="structureId"
                    name="structureId"
                    value={structureId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.structureId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  >
                    <option value="">Sélectionner une structure</option>
                    {structures.map(structure => (
                      <option key={structure.id} value={structure.id}>
                        {structure.name}
                      </option>
                    ))}
                  </select>
                  {errors.structureId && <p className="text-red-500 text-xs">{errors.structureId}</p>}
                </div>)}
                
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="telephone"
                  >
                    Téléphone
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    name="telephone"
                    placeholder="Votre numéro de téléphone"
                    value={telephone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                
               <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="password"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
                
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                    htmlFor="confirmPassword"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirmer votre mot de passe"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>
                {role === ROLES.PRESIDENT && (
                 <div className="mb-5">
                 <label
                   className="mb-3 block text-sm font-medium text-gray-700 dark:text-white"
                   htmlFor="documentFile"
                 >
                   Document de Parrainage
                 </label>
                 <input
                   type="file"
                   id="documentFile"
                   name="documentFile"
                   onChange={handleInputChange}
                   className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                 />
               </div>
              )}
              </div>
              
              </div>
              
              {localError && <p className="text-red-500 text-center">{localError}</p>}
              {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
              {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
              
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary py-4 text-lg font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
                  disabled={loading}
                >
                  {loading ?(
                      <CircularProgress size={30} color="inherit" />
                  ) : (
                      'S\'inscrire'
                  )}
                </button>
              </div>
              
              <p className="mt-4 text-center">
                Vous avez déjà un compte ?{' '}
                <Link to="/auth/signin" className="text-blue-600 hover:underline">
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
