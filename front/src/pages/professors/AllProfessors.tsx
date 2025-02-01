import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '../../components/ui/dialog';
import PaginationComponent from '../PaginationComponent';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from 'lucide-react';

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
}

interface ProfessorForm {
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
}

const AllProfessors = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    firstName: '',
    lastName: '',
    cin: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfessorForm>({
    firstName: '',
    lastName: '',
    cin: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<ProfessorForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  const getProfessors = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      if (Object.values(searchParams).some(param => param !== '')) {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
        
        const response = await axiosInstance.get(`/professors/search?${params}`);
        setProfessors(response.data);
        setTotalPages(Math.ceil(response.data.length / 5));
      } else {
        const response = await axiosInstance.get('/professors', {
          params: { page: pageNumber, size: 5 },
        });
        setProfessors(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error:any) {
      console.error('Erreur lors de la recherche:', error);
      setProfessors([]);
      setTotalPages(0);
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details ||  'Erreur lors de la récupération des professeurs',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfessors(page);
  }, [page]);

  const handlePageClick = (data: { selected: number }) => {
    setPage(data.selected);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    getProfessors(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setSearchParams({
      firstName: '',
      lastName: '',
      cin: ''
    });
    setPage(0);
    getProfessors(0);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof ProfessorForm]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors: Partial<ProfessorForm> = {};
    if (!formData.firstName) errors.firstName = 'Prénom obligatoire';
    if (!formData.lastName) errors.lastName = 'Nom obligatoire';
    if (!formData.cin) errors.cin = 'CIN obligatoire';
    if (!editingProfessor && !formData.email) errors.email = 'Email obligatoire';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (professor: Professor) => {
    console.log('Editing professor:', professor);
    setFormData({
      firstName: professor.firstName,
      lastName: professor.lastName,
      cin: professor.cin,
      email: ''
    });
    setEditingProfessor(professor);
    setIsModalOpen(true);
  };

  const handleDelete = async (professorId: string) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action ne peut pas être annulée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#f87171',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/professors/${professorId}`);
        
        Swal.fire({
          title: 'Supprimé!',
          text: 'Le professeur a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });
        
        getProfessors(page);
      } catch (error: any) {
        Swal.fire({
          title: 'Erreur!',
          text: error.response?.data?.details || 'Une erreur s\'est produite',
          icon: 'error',
          confirmButtonColor: '#f87171'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const payload = editingProfessor ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        cin: formData.cin
      } : formData;

      if (editingProfessor) {
        console.log('Updating professor:', editingProfessor.id, payload);
        await axiosInstance.put(`/professors/${editingProfessor.id}`, payload);
        Swal.fire({
          title: 'Succès!',
          text: 'Le professeur a été mis à jour avec succès',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        await axiosInstance.post('/professors', payload);
        Swal.fire({
          title: 'Succès!',
          text: 'Le professeur a été ajouté avec succès',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 3000,
          timerProgressBar: true
        });
      }

      setIsModalOpen(false);
      setEditingProfessor(null);
      resetForm();
      getProfessors(page);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details || 'Une erreur s\'est produite',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      cin: '',
      email: ''
    });
    setFormErrors({});
    setEditingProfessor(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <>
      <Breadcrumb pageName="Professeurs" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 mb-2 text-white hover:bg-opacity-90"
        >
          Ajouter un professeur
        </button>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={searchParams.firstName}
                onChange={handleInputChange}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={searchParams.lastName}
                onChange={handleInputChange}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div>
              <input
                type="text"
                name="cin"
                placeholder="CIN"
                value={searchParams.cin}
                onChange={handleInputChange}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div className="col-span-full flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="rounded bg-gray px-4 py-2 text-black transition hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Prénom</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">CIN</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>

          {isLoading ? (
            <p className="p-4 text-center">Chargement...</p>
          ) : professors.length > 0 ? (
            professors.map((professor, index) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  index === professors.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={professor.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{professor.lastName}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{professor.firstName}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{professor.cin}</p>
                </div>

                <div className="hidden items-center justify-center gap-2 p-2.5 sm:flex xl:p-5">
                  <button
                    onClick={() => handleEdit(professor)}
                    className="hover:text-primary"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(professor.id)}
                    className="hover:text-danger"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center">Aucun professeur trouvé</p>
          )}
        </div>

        {professors.length > 0 && (
          <PaginationComponent
            totalPages={totalPages}
            pageNumber={page}
            handlePageClick={handlePageClick}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProfessor ? 'Modifier le professeur' : 'Ajouter un nouveau professeur'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleFormChange}
                className={`w-full rounded border ${
                  formErrors.firstName ? 'border-danger' : 'border-stroke'
                } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
              />
              {formErrors.firstName && (
                <p className="text-danger text-sm">{formErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleFormChange}
                className={`w-full rounded border ${
                  formErrors.lastName ? 'border-danger' : 'border-stroke'
                } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
              />
              {formErrors.lastName && (
                <p className="text-danger text-sm">{formErrors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cin">CIN</Label>
              <input
                id="cin"
                name="cin"
                type="text"
                value={formData.cin}
                onChange={handleFormChange}
                className={`w-full rounded border ${
                  formErrors.cin ? 'border-danger' : 'border-stroke'
                } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
              />
              {formErrors.cin && (
                <p className="text-danger text-sm">{formErrors.cin}</p>
              )}
            </div>

            {!editingProfessor && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={`w-full rounded border ${
                    formErrors.email ? 'border-danger' : 'border-stroke'
                  } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
                />
                {formErrors.email && (
                  <p className="text-danger text-sm">{formErrors.email}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleModalClose}
                className="rounded bg-gray px-4 py-2 text-black transition hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
              >
                {isLoading ? 'Chargement...' : editingProfessor ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllProfessors;