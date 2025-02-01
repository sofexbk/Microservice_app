import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  apogee: string;
}

interface Module {
  id: string;
  name: string;
}

interface Inscription {
  id: string;
  studentId: string;
  moduleId: string;
  inscriptionDate: string;
}

interface InscriptionWithDetails {
  id: string;
  studentName: string;
  apogee: string;
  moduleName: string;
  moduleCode: string;
  inscriptionDate: string;
}

const InscriptionComponent: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [inscriptionsList, setInscriptionsList] = useState<InscriptionWithDetails[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Charger les inscriptions existantes
  const fetchInscriptions = async () => {
    try {
      const response = await axiosInstance.get(`/inscriptions`);
      setInscriptionsList(response.data);
    } catch (err:any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response.data?.details || 'Erreur lors du chargement des inscriptions',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, modulesRes] = await Promise.all([
          axiosInstance.get(`/students/all`),
          axiosInstance.get(`/modules/all`)
        ]);
        
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
        setModules(Array.isArray(modulesRes.data) ? modulesRes.data : []);
        await fetchInscriptions();
      } catch (err:any) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.response.data?.details || 'Erreur lors du chargement des données',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudent(e.target.value);
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModule(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !selectedModule) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez sélectionner un étudiant et un module.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const newInscription = {
        studentId: selectedStudent,
        moduleId: selectedModule,
        inscriptionDate: new Date().toISOString().split('T')[0]
      };

      await axiosInstance.post(`/inscriptions`, newInscription);
      
      await fetchInscriptions();
      
      setSelectedStudent('');
      setSelectedModule('');
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Inscription effectuée avec succès',
        confirmButtonColor: '#3085d6'
      });
      
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response.data?.details || 'Erreur lors de l\'inscription',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleDeleteInscription = async (inscriptionId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, désinscrire',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`/inscriptions/${inscriptionId}`);
        await fetchInscriptions();
        
        Swal.fire({
          title: 'Désinscrit !',
          text: 'L\'étudiant a été désinscrit avec succès.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
      }
    } catch (err:any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response.data?.details || 'Erreur lors de la désinscription',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-boxdark shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Inscription des étudiants à un module
      </h1>

      {/* Formulaire d'inscription */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Étudiant
            </label>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              className="w-full p-3 border border-stroke dark:border-strokedark rounded-lg bg-gray dark:bg-meta-4 text-black dark:text-white focus:border-primary focus:ring-primary"
            >
              <option value="">Sélectionnez un étudiant</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.apogee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Module
            </label>
            <select
              value={selectedModule}
              onChange={handleModuleChange}
              className="w-full p-3 border border-stroke dark:border-strokedark rounded-lg bg-gray dark:bg-meta-4 text-black dark:text-white focus:border-primary focus:ring-primary"
            >
              <option value="">Sélectionnez un module</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition duration-300"
        >
          Inscrire
        </button>
      </form>

      {/* Liste des inscriptions */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
          Inscriptions existantes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-boxdark border border-stroke dark:border-strokedark">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Étudiant
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  N° Apogée
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Module
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Code Module
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Date d'inscription
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inscriptionsList.map((inscription) => (
                <tr
                  key={inscription.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition duration-200"
                >
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {inscription.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {inscription.apogee}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {inscription.moduleName}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {inscription.moduleCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">
                    {inscription.inscriptionDate}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteInscription(inscription.id)}
                      className="text-red-500 hover:text-red-700 transition duration-300"
                    >
                      Désinscrire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InscriptionComponent;