import React, { useEffect, useState } from 'react';
import { EvenementDTO } from '../../types/EvenementDTO';
import axiosInstance from '../../axiosInstance';
import PaginationComponent from '../PaginationComponent';
import {Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, CircularProgress} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EditEvent from './EditEvent';


const EvenementSuper: React.FC = () => {
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
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

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
      const response = await axiosInstance.get('/api/evenements/externe', {
        params: {
          page: page,
          size: size,
          search: search, // Ajouter le paramètre de recherche
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
    if (evenement.documentAutorite !== null) {
      documents['Document Autorité'] = evenement.documentAutorite ?? '';
    }

    setDocuments(documents);
    setOpenModal(true);
  };

  const handleFileUpload = async (evenementId: number, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('file', file);
  
    let apiUrl = '';
    switch (documentType) {
      case 'Affiche':
        apiUrl = `/api/evenements/affiche/externe/${evenementId}`;
        break;
      case 'Programme Prévisionnel':
        apiUrl = `/api/evenements/progPrev/externe/${evenementId}`;
        break;
      case 'Liste Intervenants':
        apiUrl = `/api/evenements/listInter/externe/${evenementId}`;
        break;
      case 'Compte Rendu':
        apiUrl = `/api/evenements/compteRendu/externe/${evenementId}`;
        break;
      case 'Document Autorité':
        apiUrl = `/api/evenements/documentAutorite/externe/${evenementId}`;
        break;
      default:
        return;
    }
    setIsLoading1(true)

    try {
      const result = await Swal.fire({
        title: 'Confirmation',
        text: `Êtes-vous sûr de vouloir uploader le document ${documentType}?`,
        icon: 'warning',
        showCancelButton: true,
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-confirm-button',
          cancelButton: 'custom-swal-cancel-button'
    }});
  
      if (result.isConfirmed) {
        await axiosInstance.put(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire(
          'Succès!',
          `${documentType} uploadé avec succès !`,
          'success'
        );
      // Rafraîchir les documents après l'upload réussi
      await refreshDocuments(evenementId);      
      } else {
        Swal.fire(
          'Annulé',
          'L\'upload a été annulé.',
          'error'
        );
      }
    } catch (error) {
       // Déterminer le message d'erreur en fonction de la réponse
       const errorMessage = error.response?.data|| 'Erreur lors de l\'upload du fichier';
       Swal.fire(
         'Erreur!',
         errorMessage,
         'error'
       );
    }finally {
      setIsLoading1(false)
    }
  };
  // Fonction pour rafraîchir les documents depuis le serveur
const refreshDocuments = async (evenementId: number) => {
  try {
    const response = await axiosInstance.get(`/api/evenements/externe/${evenementId}`);
    const evenement = response.data;

    const updatedDocuments: { [key: string]: string } = {
      'Affiche': evenement.affiche,
      'Programme Prévisionnel': evenement.progPrev,
      'Liste Intervenants': evenement.listInter,
    };
    if (evenement.compteRendu !== null) {
      updatedDocuments['Compte Rendu'] = evenement.compteRendu ?? '';
    }
    if (evenement.documentAutorite !== null) {
      updatedDocuments['Document Autorité'] = evenement.documentAutorite ?? '';
    }

    setDocuments(updatedDocuments);
  } catch (error) {
    console.error('Erreur lors de la récupération des documents');
  }
};

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvenement(null);
  };
 

  const handleOpenEditModal = (evenement: EvenementDTO) => {
    setSelectedEvenement(evenement);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  }; 
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas récupérer cet événement !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/evenements/externe/${id}`);
          Swal.fire(
            'Supprimé !',
            'L\'événement a été supprimé.',
            'success'
          );
          fetchEvent(pageNumber, itemsPerPage, searchTerm); // Rafraîchir la liste après la suppression
        } catch (error) {
          Swal.fire(
            'Erreur !',
            'Une erreur s\'est produite lors de la suppression.',
            'error'
          );
        }
      }
    });
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
                      <th 
                        onClick={() => handleSort('intitule')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Intitulé {sortField === 'intitule' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Date d'événement
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Horaire
                      </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Objectif 
                    </th>
                    <th 
                        className="text-center min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Comité 
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Soutien logistique 
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Public ciblé 
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
                       Documents
                    </th>
                      <th 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                        >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {evenements && evenements.length > 0 ? (
                     evenements.map(evenement => {
                      const rowColorClass = evenement.currentEtape?.status === 'REFUSE'
                      ? 'bg-red-100' // Couleur pour les événements en cours
                      : 'bg-blue-100'; // Couleur pour les événements refusés ou autre
                      return (
                        <tr key={evenement.id} className={`text-sm ${rowColorClass}`}>
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
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center"
                        >
                          {evenement.comite}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark"
                        >
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
                          <button
                            onClick={() => handleOpenModal(evenement)}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            Voir 
                          </button>
                        </td>
                          <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                          <Button onClick={() => handleOpenEditModal(evenement)}>
                            <FaEdit className="h-5 w-5 text-primary" />
                          </Button>
                          <Button onClick={() => {
                            handleDelete(evenement.id);
                                }}  
                              >
                              <FaTrash className="h-5 w-5 text-danger" />
                        </Button>

                          </td>
                      </tr>
                      )
                        })
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
      <EditEvent
        open={editModalOpen}
        onClose={handleCloseEditModal}
        evenement={selectedEvenement}
        fetchEvent={fetchEvent}
        pageNumber={pageNumber}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
      />
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gray-100 text-gray-900 font-semibold text-center">
          Documents de l'Événement
        </DialogTitle>
        <DialogContent dividers className="p-6 flex flex-col justify-center items-center w-full">
          {isLoading || isLoading1 ? ( // Affiche un spinner pendant le chargement
              <div className="flex justify-center items-center h-40">
                <CircularProgress/>
                <span className="ml-4 text-gray-600">Chargement en cours...</span>
              </div>
          ) : (
              documents && Object.keys(documents).length > 0 ? (
                  <div className="space-y-6 w-full flex flex-col justify-center items-center">
                    {Object.entries(documents).map(([title, url]) => (
                        <div key={title} className="flex justify-between items-center w-full max-w-lg">
                          <span className="font-semibold text-gray-700 whitespace-nowrap">{title}:</span>
                          {url ? (
                              <div className="flex space-x-4 items-center">
                                <button
                                    onClick={() => downloadFile(url)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                                >
                                  Télécharger
                                </button>
                                <span className="font-semibold text-gray-600 whitespace-nowrap">Pour modifier:</span>
                                <input
                                    type="file"
                                    id={`file-upload-${title}`}
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        handleFileUpload(selectedEvenement?.id, e.target.files[0], title);
                                      }
                                    }}
                                />
                                <label
                                    htmlFor={`file-upload-${title}`}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition cursor-pointer whitespace-nowrap"
                                >
                                  Choisir un fichier
                                </label>
                              </div>
                          ) : (
                              <span className="text-gray-500">Pas de document disponible</span>
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
          <Button onClick={handleCloseModal} color="primary" variant="contained" disabled={loading}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default EvenementSuper;
