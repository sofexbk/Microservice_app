import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Book, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

interface Module {
  id: string;
  code: string;
  name: string;
  professorName: string;
}

interface Student {
  id: string;
  apogee: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

const ProfModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedModuleStudents, setSelectedModuleStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState('');

  const getModulesByProfId = async () => {
    setIsLoading(true);
    try {
      const professorId = user?.entityId;
      const response = await axiosInstance.get(`/modules/professor/${professorId}`);
      setModules(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des modules:', error);
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
    getModulesByProfId();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Mes Modules" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col">
          <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Code</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nom du Module</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Professeur</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Statut</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Etudiants</h5>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              </div>
            </div>
          ) : modules.length > 0 ? (
            modules.map((module, index) => (
              <div
                className={`grid grid-cols-5 ${
                  index === modules.length - 1
                    ? ''
                    : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={module.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-black dark:text-white">{module.code}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{module.name}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{module.professorName}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                    Actif
                  </span>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <button
                    onClick={() => fetchModuleStudents(module.id, module.name)}
                    className="hover:text-info"
                    title="Voir les étudiants"
                  >
                    <Users className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-black dark:text-white">
              Aucun module trouvé
            </p>
          )}
        </div>
      </div>

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
};

export default ProfModules;