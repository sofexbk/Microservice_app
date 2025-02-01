import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { Student } from '../../types/Student';
import PaginationComponent from '../PaginationComponent';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '../../components/ui/dialog';
import Swal from 'sweetalert2';

import { Pencil, Trash2 } from 'lucide-react';


type Gender = 'HOMME' | 'FEMME';

interface StudentForm {
  firstName: string;
  lastName: string;
  apogee: string;
  birthDate: string;
  gender: Gender;
}


const AllStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    firstName: '',
    lastName: '',
    apogee: '',
    birthDate: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<StudentForm>({
    firstName: '',
    lastName: '',
    apogee: '',
    birthDate: '',
    gender: 'HOMME'
  });
  const [formErrors, setFormErrors] = useState<Partial<StudentForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const getStudents = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      if (Object.values(searchParams).some(param => param !== '')) {
        // Construction des paramètres de recherche non vides
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
        
        // Utiliser directement le chemin relatif car baseURL est déjà configuré
        const response = await axiosInstance.get(`/students/search?${params}`);
        setStudents(response.data);
        setTotalPages(Math.ceil(response.data.length / 5));
      } else {
        const response = await axiosInstance.get('/students', {
          params: { page: pageNumber, size: 5 },
        });
        setStudents(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setStudents([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStudents(page);
  }, [page]); 

  const handlePageClick = (data: { selected: number }) => {
    setPage(data.selected);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    getStudents(0);
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
      apogee: '',
      birthDate: ''
    });
    setPage(0);
    getStudents(0);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur du champ modifié
    if (formErrors[e.target.name as keyof StudentForm]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: undefined
      });
    }
  };
  const validateForm = () => {
    const errors: Partial<StudentForm> = {};
    if (!formData.firstName) errors.firstName = 'Prénom obligatoire';
    if (!formData.lastName) errors.lastName = 'Nom obligatoire';
    if (!formData.apogee) errors.apogee = 'Apogée obligatoire';
    if (!formData.birthDate) errors.birthDate = 'Date de naissance obligatoire';
    
    if (formData.birthDate && new Date(formData.birthDate) >= new Date()) {
      errors.birthDate = 'La date de naissance doit être dans le passé';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (student: Student) => {
    // Convertir la date du format dd-MM-yyyy au format yyyy-MM-dd pour l'input date
    const [day, month, year] = student.birthDate.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      apogee: student.apogee,
      birthDate: formattedDate,
      gender: student.gender as Gender
    });
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId: number) => {
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
        await axiosInstance.delete(`/students/${studentId}`);
        
        Swal.fire({
          title: 'Supprimé!',
          text: 'L\'étudiant a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });
        
        getStudents(page);
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
      
      const dateParts = new Date(formData.birthDate)
        .toLocaleDateString('fr-FR')
        .split('/')
        .join('-');

      const payload = {
        ...formData,
        birthDate: dateParts
      };

      if (editingStudent) {
        // Mise à jour
        await axiosInstance.put(`/students/${editingStudent.id}`, payload);
        Swal.fire({
          title: 'Succès!',
          text: 'L\'étudiant a été mis à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        // Création
        await axiosInstance.post('/students', payload);
        Swal.fire({
          title: 'Succès!',
          text: 'L\'étudiant a été ajouté avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6',
          timer: 3000,
          timerProgressBar: true
        });
      }

      setIsModalOpen(false);
      setEditingStudent(null);
      resetForm();
      getStudents(page);

    } catch (error: any) {
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details || 'Une erreur s\'est produite',
        icon: 'error',
        confirmButtonText: 'OK',
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
      apogee: '',
      birthDate: '',
      gender: 'HOMME'
    });
    setFormErrors({});
    setEditingStudent(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };


  return (
    <>
      <Breadcrumb pageName="Étudiants" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 mb-2 text-white hover:bg-opacity-90"
          >
            Ajouter un étudiant
          </button>

        {/* Search Form */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
                name="apogee"
                placeholder="Apogée"
                value={searchParams.apogee}
                onChange={handleInputChange}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div>
              <input
                type="date"
                name="birthDate"
                value={searchParams.birthDate}
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

        {/* Student Table */}
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Prénom</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Apogée</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Date de Naissance</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Genre</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>

          {isLoading ? (
            <p className="p-4 text-center">Chargement...</p>
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-6 ${
                  index === students.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={student.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{student.lastName}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{student.firstName}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{student.apogee}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">{student.birthDate}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-meta-5">{student.gender}</p>
                </div>

                <div className="hidden items-center justify-center gap-2 p-2.5 sm:flex xl:p-5">
                  <button
                    onClick={() => handleEdit(student)}
                    className="hover:text-primary"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="hover:text-danger"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center">Aucun étudiant trouvé</p>
          )}
        </div>

        {/* Pagination */}
        {students.length > 0 && (
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
          {editingStudent ? 'Modifier l\'étudiant' : 'Ajouter un nouvel étudiant'}
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
          <Label htmlFor="apogee">Apogée</Label>
          <input
            id="apogee"
            name="apogee"
            type="text"
            value={formData.apogee}
            onChange={handleFormChange}
            className={`w-full rounded border ${
              formErrors.apogee ? 'border-danger' : 'border-stroke'
            } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
          />
          {formErrors.apogee && (
            <p className="text-danger text-sm">{formErrors.apogee}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleFormChange}
            className={`w-full rounded border ${
              formErrors.birthDate ? 'border-danger' : 'border-stroke'
            } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
          />
          {formErrors.birthDate && (
            <p className="text-danger text-sm">{formErrors.birthDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Genre</Label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleFormChange}
            className="w-full rounded border border-stroke bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
          >
            <option value="HOMME">Homme</option>
            <option value="FEMME">Femme</option>
          </select>
        </div>

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
            {isLoading ? 'Chargement...' : editingStudent ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
    </>
  );
};

export default AllStudents;