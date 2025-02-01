import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import Swal from 'sweetalert2';
import { UserCircle, Key } from 'lucide-react';

interface ProfessorProfile {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
}

interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfessorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfessorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });
  const [passwordData, setPasswordData] = useState<PasswordUpdate>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfessorProfile();
  }, []);

  const fetchProfessorProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/professors/${user?.entityId}`);
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération du profil:', error);
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details || 'Erreur lors de la récupération du profil',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!formData.firstName) {
      errors.firstName = 'Le prénom est requis';
      isValid = false;
    }
    if (!formData.lastName) {
      errors.lastName = 'Le nom est requis';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validatePasswordForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!passwordData.oldPassword) {
      errors.oldPassword = "L'ancien mot de passe est requis";
      isValid = false;
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
      isValid = false;
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
      isValid = false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axiosInstance.put(`/professors/${user?.entityId}`, {
        ...profile,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      Swal.fire({
        title: 'Succès!',
        text: 'Profil mis à jour avec succès',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      });

      setIsEditMode(false);
      fetchProfessorProfile();
    } catch (error: any) {
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details || 'Erreur lors de la mise à jour du profil',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      await axiosInstance.put(`/auth/update-password/${user?.userId}`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      Swal.fire({
        title: 'Succès!',
        text: 'Mot de passe mis à jour avec succès',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      });

      setIsPasswordModalOpen(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la mise à jour du mot de passe',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>;
  }

  return (
    <>
      <Breadcrumb pageName="Mon Profil" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <UserCircle className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Informations Personnelles
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gérez vos informations personnelles et votre sécurité
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            <Key className="h-5 w-5" />
            Modifier le mot de passe
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              CIN
            </label>
            <input
              type="text"
              value={profile?.cin || ''}
              disabled
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:bg-gray-2 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:disabled:bg-meta-4"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary dark:disabled:bg-meta-4 ${
                formErrors.firstName ? 'border-danger' : ''
              }`}
            />
            {formErrors.firstName && (
              <p className="text-danger text-sm mt-1">{formErrors.firstName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary dark:disabled:bg-meta-4 ${
                formErrors.lastName ? 'border-danger' : ''
              }`}
            />
            {formErrors.lastName && (
              <p className="text-danger text-sm mt-1">{formErrors.lastName}</p>
            )}
          </div>

          <div className="flex gap-4">
            {!isEditMode ? (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="inline-flex items-center justify-center rounded bg-primary px-6 py-2 mb-2 text-white hover:bg-opacity-90"
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setFormData({
                      firstName: profile?.firstName || '',
                      lastName: profile?.lastName || ''
                    });
                  }}
                  className="inline-flex items-center justify-center rounded bg-gray px-6 py-2 text-black hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Ancien mot de passe
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                  formErrors.oldPassword ? 'border-danger' : ''
                }`}
              />
              {formErrors.oldPassword && (
                <p className="text-danger text-sm mt-1">{formErrors.oldPassword}</p>
              )}
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                  formErrors.newPassword ? 'border-danger' : ''
                }`}
              />
              {formErrors.newPassword && (
                <p className="text-danger text-sm mt-1">{formErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                  formErrors.confirmPassword ? 'border-danger' : ''
                }`}
              />
              {formErrors.confirmPassword && (
                <p className="text-danger text-sm mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="rounded bg-gray px-4 py-2 text-black transition hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
    );
}

export default ProfessorProfile;