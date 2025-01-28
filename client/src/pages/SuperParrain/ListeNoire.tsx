import React, { useEffect, useState } from 'react';
import { UserDTO } from '../../types/userDTO';
import axiosInstance from '../../axiosInstance';
import PaginationComponent from '../PaginationComponent';
import { TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

const ListeNoire: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page
  const [sortField, setSortField] = useState<keyof UserDTO>('email'); // Champ de tri par défaut
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Ordre de tri par défaut
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<{ [userId: number]: boolean }>({}); // Suivi des états de chargement individuels

  const downloadFile = async (fileUrl: string, userId: number) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [userId]: true }));
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
      fileLink.setAttribute('download', 'document_parrainage.pdf'); // Adjust filename as needed
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier' );
    }finally {
      setIsLoading((prevLoading) => ({ ...prevLoading, [userId]: false }));
    }
  };

  const handleDownloadClick = (fileUrl: string | undefined, userId: number) => {
    if (fileUrl) {
      downloadFile(fileUrl, userId);
    } else {
      console.error('File URL is undefined');
    }
  };
  
   // Fonction pour retirer un utilisateur de la liste noire
   const whitelistUser = async (userId: number) => {
    try {
      await axiosInstance.post(`/api/whitelist/${userId}`);
      // Recharger la liste des utilisateurs après succès
      fetchUsers(pageNumber, itemsPerPage);
    } catch (error) {
      console.error('Erreur lors de la suppression de la liste noire');
    }
  };

  // Fonction pour gérer l'action de whitelist avec confirmation
  const handleWhitelistClick = (userId: number) => {
    Swal.fire({
      title: 'Confirmer',
      text: "Êtes-vous sûr de vouloir retirer cet utilisateur de la liste noire ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        whitelistUser(userId);
        Swal.fire(
          'Retiré!',
          'L’utilisateur a été retiré de la liste noire.',
          'success'
        );
      }
    });
  };
  
  const fetchUsers = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/evenements/blacklisted-presidents', {
        params: {
          page: page,
          size: size,
        }
      });
  

  
      const usersData = response.data.content;
        setTotalPages(response.data.totalPages);
      setUsers(usersData);
  
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
// Utiliser useEffect pour récupérer les utilisateurs à chaque changement de page, taille ou terme de recherche
useEffect(() => {
  fetchUsers(pageNumber, itemsPerPage);
}, [pageNumber, itemsPerPage]);

  // Fonction pour trier les utilisateurs
  const sortUsers = (users: UserDTO[]) => {
    const sortedUsers = [...users].sort((a, b) => {
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
    setUsers(sortedUsers);
  };

// Utiliser useEffect pour récupérer les utilisateurs à chaque changement de page, taille ou terme de recherche



  useEffect(() => {
    // Re-trier les utilisateurs chaque fois que le champ ou l'ordre de tri change
    if (users.length > 0) {
      sortUsers(users);
    }  
  }, [sortField, sortOrder]);

  const handlePageClick = (data: { selected: number }) => {
    const newPageNumber = data.selected;  // Assurez-vous que l'index est correct
    setPageNumber(newPageNumber);
  };
  
  const handleSort = (field: keyof UserDTO) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex items-center mb-4 space-x-6"> {/* Flexbox pour aligner les éléments avec espacement */}
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
        ) : users.length === 0 ? (
            <p className="text-center">Aucun donné disponible.</p>
            ) : (
            <>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-center dark:bg-meta-4 ">
                      <th 
                        onClick={() => handleSort('email')} 
                        className="min-w-[150px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Email {sortField === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('lastName')} 
                        className="min-w-[100px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Nom {sortField === 'lastName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('firstName')} 
                        className="min-w-[100px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                       Prénom {sortField === 'firstName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th 
                        onClick={() => handleSort('telephone')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Telephone {sortField === 'telephone' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        onClick={() => handleSort('structure')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Structure {sortField === 'structure' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        className="py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Document de Parrainage 
                    </th> 
                    <th 
                        className="py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Actions 
                    </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="text-sm">
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.email}
                        </td>
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.lastName}
                        </td>
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.firstName}
                        </td>
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.telephone}
                        </td>
                        <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.structure?.name}
                        </td>
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                            {user.documentParrainage ? (
                                <button
                                    onClick={() =>
                                        handleDownloadClick(
                                            user.documentParrainage,
                                            user.id
                                        )
                                    }
                                    className={`bg-blue-500 text-white py-2 px-4 rounded ${
                                        isLoading[user.id]
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'hover:bg-blue-600'
                                    }`}
                                    disabled={isLoading[user.id]}
                                >
                                  {isLoading[user.id]
                                      ? 'En cours...'
                                      : 'Télécharger'}
                                </button>
                            ) : 'NONE'}
                          </td>
                          <td>
                            <button 
                            onClick={() => handleWhitelistClick(user.id)} 
                            className="text-blue-500 hover:underline"
                            >
                            <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                            Retirer de la liste noire
                            </button>
                                </td>
                            </tr>
                    ))}
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
    </>
  );
};

export default ListeNoire;
