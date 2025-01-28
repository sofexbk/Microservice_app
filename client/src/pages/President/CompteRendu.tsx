import React, { useEffect, useState } from 'react';
import { EvenementDTO } from '../../types/EvenementDTO';
import axiosInstance from '../../axiosInstance';
import PaginationComponent from '../PaginationComponent';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Swal from 'sweetalert2'; // Importer SweetAlert2
import { getUser } from '../security/JwtDecoder';
   



const CompteRendu: React.FC = () => {
  const [evenements, setEvenements] = useState<EvenementDTO[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page
  const [sortField, setSortField] = useState<keyof EvenementDTO>('createdAt'); // Champ de tri par défaut
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Ordre de tri par défaut
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 Mo
  const [isLoading,setIsLoading]=useState<boolean>(false)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };
  const user = getUser();

  
  const fetchEvent = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      
      const response = await axiosInstance.get(`/api/evenements/presidentcpt/${user?.userId}`, {
        params: {
          page: page,
          size: size,
          search: search, // Ajouter le paramètre de recherche
          presidentId:user?.userId
        }
      });

      const evenementsData = response.data.content;
      setTotalPages(response.data.totalPages);
  
      setEvenements(evenementsData);
  
    } catch (error) {
      console.error('Error fetching events');
      setEvenements([]);
    } finally {
      setLoading(false);
    }
  };
  
// Utiliser useEffect pour récupérer les utilisateurs à chaque changement de page, taille ou terme de recherche
useEffect(() => {
  fetchEvent(pageNumber, itemsPerPage, searchTerm);
}, [pageNumber, itemsPerPage, searchTerm]);

  // Fonction pour trier les utilisateurs
  const sortEvents = (evenements: EvenementDTO[]) => {
    const sortedEvents = [...evenements].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0; // En cas d'égalité ou de types différents
    });
    setEvenements(sortedEvents);
  };
  const validateFile = (file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      return `Le fichier dépasse la taille maximale autorisée de 30 Mo.`;
    }
    return null;
  };
  
// Utiliser useEffect pour récupérer les utilisateurs à chaque changement de page, taille ou terme de recherche

  useEffect(() => {
    // Re-trier les utilisateurs chaque fois que le champ ou l'ordre de tri change
    if (evenements.length > 0) {
      sortEvents(evenements);
    }  
  }, [sortField, sortOrder]);

  const handlePageClick = (data: { selected: number }) => {
    const newPageNumber = data.selected;  // Assurez-vous que l'index est correct
    setPageNumber(newPageNumber);
  };
  
  const handleSort = (field: keyof EvenementDTO) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const validationError = validateFile(selectedFile);
      if (validationError) {
        Swal.fire({
          title: 'Erreur',
          text: validationError,
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };
  
 

  const handleUploadFile = async () => {
    if (file && selectedEventId) {
      const formData = new FormData();
      formData.append('compteRenduFile', file);
      setIsLoading(true)
      try {
        const response = await axiosInstance.put(
          `/api/evenements/${selectedEventId}/deposer-compte-rendu`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        Swal.fire({
          title: 'Succès',
          text: response.data,
          icon: 'success',
          confirmButtonText: 'OK',
        });
  
        fetchEvent(pageNumber, itemsPerPage, searchTerm);
        setFile(null);
        setUploadModalOpen(false);
      } catch (error: any) {
        Swal.fire({
          title: 'Erreur',
          text: error.response?.data || 'Une erreur est survenue.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }finally {
        setIsLoading(false)
      }
    }
  };
  
  const handleOpenUploadModal = (evenementId: number) => {
    setSelectedEventId(evenementId);
    setUploadModalOpen(true);
  };
  
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setFile(null);
  };
  
  return (
    <>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex items-center mb-4 space-x-6"> {/* Flexbox pour aligner les éléments avec espacement */}
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-40" // Espacement entre la barre de recherche et les autres éléments
            sx={{ mr: 2 }} 
            />
          <TextField
            select
            label="Éléments par page"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            className="w-40"
            size="small"
          >
            {[5, 10, 15, 20].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </TextField>
        </div>
        
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent">
      </div>
    </div>
         ) :  (
            <>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                       <th className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white text-xs sm:text-sm">
                        Dépôt de Compte Rendu
                        </th>
                      <th 
                        onClick={() => handleSort('intitule')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Intitulé {sortField === 'intitule' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Date D'événement 
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Horaire 
                      </th>
                      <th 
                        onClick={() => handleSort('objectif')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Objectif {sortField === 'objectif' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        onClick={() => handleSort('comite')} 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Comite {sortField === 'comite' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('soutienLogistique')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Soutien Logistique {sortField === 'soutienLogistique' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('publicCible')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Public Ciblé {sortField === 'publicCible' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('structureName')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Structure {sortField === 'structureName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        onClick={() => handleSort('createdAt')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Date de demande {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    
                    <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Motif de refus
                    </th>
                    <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Étape
                    </th>
                    <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Statut
                    </th>
                      
                    </tr>
                  </thead>
                  <tbody>
                  {evenements && evenements.length > 0 ? (
                     evenements.map(evenement => (
                      <tr key={evenement.id} className="text-sm">
                        <td className="py-4 px-2">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleOpenUploadModal(evenement.id)}
                            >
                            Déposer
                        </Button>
                            </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {evenement.intitule}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark"
                        style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {evenement.dates.map(date => (
                            <div key={date}>{date}</div>
                          ))}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark"
                         style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                         >
                          {evenement.horaires.map((horaire, index) => (
                            <div key={index}>{horaire}</div>
                          ))}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark" style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {evenement.objectif.length > 30 ? (
                            <details>
                              <summary style={{ cursor: 'pointer' }}>
                                {evenement.objectif.slice(0, 30)}...
                              </summary>
                              <p>{evenement.objectif}</p>
                            </details>
                          ) : (
                            evenement.objectif
                          )}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                          {evenement.comite}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {evenement.soutienLogistique}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                        {evenement.publicCible && evenement.publicCible.length > 0 ? (
                          evenement.publicCible.map((cible, index) => (
                            <span key={index}>
                              {cible}
                              {index < evenement.publicCible.length - 1 && " "}
                            </span>
                          ))
                        ) : (
                          <span>Aucune donnée</span>
                        )}
                      </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {evenement.structureName}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                        {formatDate(evenement.createdAt)}
                        </td>
                        
                          <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                            {evenement.currentEtape?.motifRefus ? evenement.currentEtape?.motifRefus : 'Pas de Motif'}
                          </td>
                          <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                            {evenement.currentEtape?.niveau}
                          </td>
                          <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                            {evenement.currentEtape?.status}
                          </td>
                          
                      </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={15} className="text-center py-4">Aucun événement disponible</td>
                        </tr>
                      )}
                  </tbody>
                </table>
            </>
          )}
        </div>
        <Dialog open={uploadModalOpen} onClose={handleCloseUploadModal}>
          <DialogTitle>Dépôt de Compte Rendu</DialogTitle>
          <DialogContent>
          <label
        htmlFor="file-upload"
        style={{
          border: '1px solid #007BFF',
          display: 'inline-block',
          padding: '8px 16px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.3s ease',
        }}
      >
        Choisir un fichier PDF
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input
      />
          </DialogContent>
          {file && (
          <p style={{ marginTop: '10px' }}>
            Fichier sélectionné : <strong>{file.name}</strong>
          </p>
        )}
          <DialogActions>
            <Button onClick={handleCloseUploadModal} color="primary">
              Annuler
            </Button>
            <Button
                onClick={handleUploadFile}
                color="primary"
                disabled={isLoading || !file} // Désactiver le bouton pendant l'upload ou si aucun fichier n'est sélectionné
            >
              {isLoading ? 'En cours de dépôt...' : 'Déposer'}
            </Button>
          </DialogActions>
        </Dialog>

        <div className="mt-4 mb-2">
          {!loading && totalPages > 0 && (
        <PaginationComponent
        totalPages={totalPages}
        pageNumber={pageNumber}
        handlePageClick={handlePageClick}
      />
          )}
        </div>
      </div>
      </>
  );
};

export default CompteRendu;
