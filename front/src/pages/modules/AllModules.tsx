import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '../../components/ui/dialog';
import PaginationComponent from '../PaginationComponent';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { Pencil, Trash2, UserPlus, UserMinus, Users } from 'lucide-react';

interface Module {
  id: string;
  code: string;
  name: string;
  professorName: string;
}

interface ModuleForm {
  code: string;
  name: string;
}
interface ProfessorDTO {
    id: string;
    firstName: string;
    lastName: string;
    cin: string;
}
interface Student {
  id: string;
  apogee: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}
const AllModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    code: '',
    name: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ModuleForm>({
    code: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<ModuleForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [professors, setProfessors] = useState<ProfessorDTO[]>([]);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedModuleStudents, setSelectedModuleStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState('');

  const getModules = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      if (searchParams.code || searchParams.name) {
        // Utiliser l'endpoint /search si des paramètres de recherche sont fournis
        const params = new URLSearchParams();
        if (searchParams.code) params.append('code', searchParams.code);
        if (searchParams.name) params.append('name', searchParams.name);
  
        const response = await axiosInstance.get(`/modules/search?${params}`);
        setModules(response.data); // Pas de pagination pour les résultats de recherche
        setTotalPages(1); // Une seule page pour les résultats de recherche
      } else {
        // Utiliser l'endpoint /modules pour récupérer tous les modules avec pagination
        const response = await axiosInstance.get('/modules', {
          params: { page: pageNumber, size: 5 },
        });
        setModules(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération:', error);
      setModules([]);
      setTotalPages(0);
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details || 'Erreur lors de la récupération des modules',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await axiosInstance.get('/professors/all');
      setProfessors(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des professeurs:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la récupération des professeurs',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    }
  };

  const fetchModuleStudents = async (moduleId: string, moduleName: string) => {
    setIsLoadingStudents(true);
    try {
      const response = await axiosInstance.get(`/modules/${moduleId}/students`);
      setSelectedModuleStudents(response.data);
      setSelectedModuleName(moduleName);
      setIsStudentsModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      Swal.fire({
        title: 'Erreur!',
        text: error.response?.data?.details || 'Erreur lors de la récupération des étudiants',
        icon: 'error',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setIsLoadingStudents(false);
    }
  };

  
  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    getModules(page);
  }, [page]);

  const handlePageClick = (data: { selected: number }) => {
    setPage(data.selected);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Réinitialiser la page à 0
    getModules(0); // Appeler la recherche
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setSearchParams({
      code: '',
      name: ''
    });
    setPage(0);
    getModules(0); // Recharger tous les modules
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof ModuleForm]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors: Partial<ModuleForm> = {};
    if (!formData.code) errors.code = 'Code obligatoire';
    if (!formData.name) errors.name = 'Nom obligatoire';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (module: Module) => {
    setFormData({
      code: module.code,
      name: module.name
    });
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const handleDelete = async (moduleId: string) => {
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
        await axiosInstance.delete(`/modules/${moduleId}`);
        
        Swal.fire({
          title: 'Supprimé!',
          text: 'Le module a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });
        
        getModules(page);
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
      
      if (editingModule) {
        await axiosInstance.put(`/modules/${editingModule.id}`, formData);
        Swal.fire({
          title: 'Succès!',
          text: 'Le module a été mis à jour avec succès',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        await axiosInstance.post('/modules', formData);
        Swal.fire({
          title: 'Succès!',
          text: 'Le module a été ajouté avec succès',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 3000,
          timerProgressBar: true
        });
      }

      setIsModalOpen(false);
      setEditingModule(null);
      resetForm();
      getModules(page);

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
      code: '',
      name: ''
    });
    setFormErrors({});
    setEditingModule(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

const handleAssignProfessor = async (moduleId: string) => {
  const { value: professorId } = await Swal.fire({
    title: 'Assigner un professeur',
    input: 'select',
    inputOptions: professors.reduce((options, professor) => {
      options[professor.id] = `${professor.firstName} ${professor.lastName}`;
      return options;
    }, {} as { [key: string]: string }),
    inputPlaceholder: 'Sélectionnez un professeur',
    showCancelButton: true,
    confirmButtonText: 'Assigner',
    cancelButtonText: 'Annuler'
  });

  if (professorId) {
    try {
      await axiosInstance.put(`/modules/${moduleId}/assign-professor/${professorId}`);
      Swal.fire('Succès!', 'Professeur assigné avec succès', 'success');
      getModules(page);
    } catch (error) {
      Swal.fire('Erreur!', 'Erreur lors de l\'assignation du professeur', 'error');
    }
  }
};

  return (
    <>
      <Breadcrumb pageName="Modules" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 mb-2 text-white hover:bg-opacity-90"
        >
          Ajouter un module
        </button>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="text"
                name="code"
                placeholder="Code"
                value={searchParams.code}
                onChange={handleInputChange}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              />
            </div>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nom"
                value={searchParams.name}
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
              <h5 className="text-sm font-medium uppercase xsm:text-base">Code</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Professeur</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>

          {isLoading ? (
            <p className="p-4 text-center">Chargement...</p>
          ) : modules.length > 0 ? (
            modules.map((module, index) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  index === modules.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={module.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{module.code}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{module.name}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{module.professorName || 'Non assigné'}</p>
                </div>

                <div className="hidden items-center justify-center gap-2 p-2.5 sm:flex xl:p-5">
                  <button
                    onClick={() => handleEdit(module)}
                    className="hover:text-primary"
                    title="Modifier"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleAssignProfessor(module.id)}
                    className="hover:text-success"
                    title="Assigner un professeur"
                    >
                    <UserPlus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => fetchModuleStudents(module.id, module.name)}
                      className="hover:text-info"
                      title="Voir les étudiants"
                    >
                      <Users className="h-5 w-5" />
                    </button>
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="hover:text-danger"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center">Aucun module trouvé</p>
          )}
        </div>

        {modules.length > 0 && (
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
              {editingModule ? 'Modifier le module' : 'Ajouter un nouveau module'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleFormChange}
                className={`w-full rounded border ${
                  formErrors.code ? 'border-danger' : 'border-stroke'
                } bg-gray px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
              />
              {formErrors.code && (
                <p className="text-danger text-sm">{formErrors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                className={`w-full rounded border ${
                  formErrors.name ? 'border-danger' : 'border-stroke'
                } bg-gray px-4 py-2 outline-none focus:border-primary dark border-strokedark dark:bg-meta-4 dark:focus:border-primary`}
                />
                {formErrors.name && (
                  <p className="text-danger text-sm">{formErrors.name}</p>
                )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleModalClose}
                className="rounded bg-gray px-4 py-2 text-black transition hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
            </form>
            </DialogContent>
            </Dialog>
            <Dialog open={isStudentsModalOpen} onOpenChange={() => setIsStudentsModalOpen(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Étudiants du module: {selectedModuleName}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingStudents ? (
            <div className="flex justify-center p-4">
              <p>Chargement des étudiants...</p>
            </div>
          ) : selectedModuleStudents.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-2 dark:bg-meta-4">
                  <tr>
                    <th className="p-2.5 text-left">Apogée</th>
                    <th className="p-2.5 text-left">Nom</th>
                    <th className="p-2.5 text-left">Prénom</th>
                    <th className="p-2.5 text-left">Date de naissance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedModuleStudents.map((student) => (
                    <tr key={student.id} className="border-b border-stroke dark:border-strokedark">
                      <td className="p-2.5">{student.apogee}</td>
                      <td className="p-2.5">{student.lastName}</td>
                      <td className="p-2.5">{student.firstName}</td>
                      <td className="p-2.5">
                        {new Date(student.birthDate).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center p-4">
              <p>Aucun étudiant inscrit dans ce module</p>
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsStudentsModalOpen(false)}
              className="rounded bg-gray px-4 py-2 text-black transition hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
            >
              Fermer
            </button>
          </div>
        </DialogContent>
      </Dialog>
            </>
            );
            }
export default AllModules;