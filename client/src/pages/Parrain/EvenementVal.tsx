import React, { useEffect, useState } from 'react';
import { EvenementDTO } from '../../types/EvenementDTO';
import axiosInstance from '../../axiosInstance';
import PaginationComponent from '../PaginationComponent';
import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import { getUser } from '../security/JwtDecoder';

const EvenementVal: React.FC = () => {
  const [evenements, setEvenements] = useState<EvenementDTO[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page
  const [sortField, setSortField] = useState<keyof EvenementDTO>('createdAt'); // Champ de tri par défaut
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Ordre de tri par défaut
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [documents, setDocuments] = useState<{ [key: string]: string }>({});
  const [selectedEvenement, setSelectedEvenement] = useState<EvenementDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };
  
  
    const user = getUser();

  
  const downloadFile = async (fileUrl: string) => {
    setIsLoading(true)
    try {
      // Ensure the URL is properly encoded for the query parameter
      const encodedFileUrl = encodeURIComponent(fileUrl);
      // Construct the file download URL with the fileUrl as a query parameter
      const apiUrl = `/api/evenements/download?url=${encodedFileUrl}`;
      // Fetch the file from the server
      const response = await axiosInstance.get(apiUrl, {
        responseType: 'blob',
      });
      // Create a URL for the blob
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'documents_evenements.pdf'); // Adjust filename as needed
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier');
    }finally {
      setIsLoading(false)
    }
  };
  

  const fetchEvent = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/evenements/structure/${user?.userId}`, {
        params: {
          page: page,
          size: size,
          search: search, // Ajouter le paramètre de recherche
          parrainId:user?.userId
        }
      });


  
      const evenementsData = response.data.content;
      setTotalPages(response.data.totalPages);
      setEvenements(evenementsData);
    } catch (error) {
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

  const handleOpenModal = (evenement: EvenementDTO) => {
    setSelectedEvenement(evenement);
  
    // Construire l'objet documents conditionnellement
    const documents: { [key: string]: string } = {
      'Affiche': evenement.affiche,
      'Programme Prévisionnel': evenement.progPrev,
      'Liste Intervenants': evenement.listInter,
    };
    // Ajouter 'Compte Rendu' seulement si ce n'est pas null
    if (evenement.compteRendu !== null) {
      documents['Compte Rendu'] = evenement.compteRendu ?? '';
    }
    // Ajouter 'Compte Rendu' seulement si ce n'est pas null
    if (evenement.documentAutorite !== null) {
      documents['Document Autorité'] = evenement.documentAutorite ?? '';
    }
    setDocuments(documents);
    setOpenModal(true);
  };
  
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvenement(null);
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
          ) : evenements.length === 0 ? (
            <p className="text-center">Aucun événement validé.</p>
          ) : (
            <>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th 
                        onClick={() => handleSort('intitule')} 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Intitulé {sortField === 'intitule' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Date d'événement 
                    </th>
                      <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Horaire
                      </th>
                      <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Objectif 
                    </th>
                      <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Soutien logistique 
                    </th>
                    <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Comité 
                    </th>
                    <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Président(e)
                    </th>
                      <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Public ciblé
                    </th>
                      <th 
                        onClick={() => handleSort('structureName')} 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Structure {sortField === 'structureName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        onClick={() => handleSort('createdAt')} 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Date de demande {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Documents
                    </th>                                    
                    </tr>
                  </thead>
                  <tbody>
                    {evenements.map(evenement => {
                       return (
                      <tr key={evenement.id} className='text-sm'>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
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
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                          {evenement.presidentName}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                          {evenement.soutienLogistique}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
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
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                          {evenement.structureName}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                        {formatDate(evenement.createdAt)}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                          <button
                            onClick={() => handleOpenModal(evenement)}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            Voir 
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
            </>
          )}
        </div>
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
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gray-100 text-gray-900 font-semibold text-center">
          Documents de l'Événement
        </DialogTitle>
        <DialogContent dividers className="p-6 flex flex-col items-center">
          {isLoading ? ( // Affiche un spinner pendant le chargement
              <div className="flex justify-center items-center h-40">
                <CircularProgress />
                <span className="ml-4 text-gray-600">Chargement en cours...</span>
              </div>
          ) : (
              documents && Object.keys(documents).length > 0 ? (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    {Object.entries(documents).map(([title, url]) => (
                        <div
                            key={title}
                            className="flex items-center justify-between w-full max-w-lg space-x-2"
                        >
                          <span className="font-semibold text-gray-700">{title} :</span>
                          {url ? (
                              <button
                                  onClick={() => downloadFile(url)}
                                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                              >
                                Télécharger
                              </button>
                          ) : (
                              <span className="ml-4 text-gray-500">
                  Pas de document disponible
                </span>
                          )}
                        </div>
                    ))}
                  </div>
              ) : (
                  <p className="text-gray-500 text-center">Aucun document disponible.</p>
              )
          )}
        </DialogContent>
        <DialogActions className="justify-center">
          <Button onClick={handleCloseModal} color="primary" variant="contained">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EvenementVal;
