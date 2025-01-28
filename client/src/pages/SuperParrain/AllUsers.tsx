import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaUser, FaUserSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { UserDTO } from '../../types/userDTO';
import axiosInstance from '../../axiosInstance';
import PaginationComponent from '../PaginationComponent';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const AllUsersEvent: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page
  const [sortField, setSortField] = useState<keyof UserDTO>('email'); // Champ de tri par défaut
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Ordre de tri par défaut
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<UserDTO | null>(null);
  const [structures, setStructures] = useState<Structure[]>([]); // Explicit type
  const [isLoading, setIsLoading] = useState<{ [userId: number]: boolean }>({}); // Suivi des états de chargement individuels

  interface Structure {
    id: string;
    name: string;
  }
  
  // Fetch structures when the dialog is open
  useEffect(() => {
    if (isUpdateModalOpen) {
      axiosInstance.get('/api/structures/np')
        .then(response => {
          setStructures(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des structures' );
        });
    }
  }, [isUpdateModalOpen]);
  const handleStructureChange = (event: SelectChangeEvent<string>) => {
    // Recherche de la structure sélectionnée par son ID
    const selectedStructure = structures.find(s => s.id === event.target.value);
  
    if (userToUpdate && selectedStructure) {
      setUserToUpdate({
        ...userToUpdate,
        structure: {
          id: selectedStructure.id, // Affectation de l'ID
          name: selectedStructure.name, // Affectation du nom
        },
      });
    }
  };

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
  
  
  
  const fetchUsers = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/users', {
        params: {
          page: page,
          size: size,
          search: search, // Ajouter le paramètre de recherche
        }
      });

  
      const usersData = response.data;
  
      const totalPagesFromResponse = parseInt(response.headers['x-total-pages'], 10);
      setTotalPages(isNaN(totalPagesFromResponse) ? 0 : totalPagesFromResponse);
      setUsers(usersData);
  
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
   // Fonction pour activer un utilisateur avec confirmation
   const handleActivate = (userId: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous êtes sur le point d'activer cet utilisateur.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, activer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.post(`/api/activate/${userId}`);
          fetchUsers(pageNumber, itemsPerPage, searchTerm); // Recharger les utilisateurs après activation
          Swal.fire(
            'Activé!',
            "L'utilisateur a été activé.",
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Erreur!',
            "Une erreur est survenue lors de l'activation de l'utilisateur.",
            'error'
          );}
      }
    });
  };
// Utiliser useEffect pour récupérer les utilisateurs à chaque changement de page, taille ou terme de recherche
useEffect(() => {
  fetchUsers(pageNumber, itemsPerPage, searchTerm);
}, [pageNumber, itemsPerPage, searchTerm]);

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

const handleDelete = async (userId: number) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Cette action est irréversible!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await axiosInstance.delete(`/api/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
    } catch (error) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Il y a eu une erreur lors de la suppression de l\'utilisateur.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
};

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

 

  const handleDeactivate = async (userId: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "L'utilisateur sera désactivé!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f39c12',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, désactiver!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/api/desactivate/${userId}`);
        setUsers(users.map(user => user.id === userId ? { ...user, enabled: false } : user));
        Swal.fire('Désactivé!', 'L\'utilisateur a été désactivé.', 'success');
      } catch (error) {
        Swal.fire({
          title: 'Erreur!',
          text: 'Il y a eu une erreur lors de la désactivation de l\'utilisateur.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  const handleUpdate = (user: UserDTO) => {
    setUserToUpdate(user);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userToUpdate) {
      setUserToUpdate({ ...userToUpdate, [e.target.name]: e.target.value });
    }
  };

  const handleSubmitUpdate = async () => {
    if (userToUpdate) {
      try {
        await axiosInstance.put(`/api/${userToUpdate.id}`, userToUpdate);
        setUsers(users.map(user => user.id === userToUpdate.id ? userToUpdate : user));
        setIsUpdateModalOpen(false);
        Swal.fire('Mis à jour!', 'L\'utilisateur a été mis à jour.', 'success');
      } catch (error) {
        Swal.fire({
          title: 'Erreur!',
          text: 'Il y a eu une erreur lors de la mise à jour de l\'utilisateur.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
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
                        onClick={() => handleSort('enabled')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Actif {sortField === 'enabled' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('emailVerified')} 
                        className="min-w-[80px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Vérifié {sortField === 'emailVerified' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                      <th 
                        onClick={() => handleSort('role')} 
                        className="py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Rôle {sortField === 'role' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                        className="py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm"
                      >
                    Document de Parrainage 
                    </th>
                      <th className=" min-w-[80px] py-4 px-2 font-medium  text-black dark:text-white text-xs sm:text-sm">
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
                          {user.structure?.name || 'NONE'}
                        </td>
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.enabled ? 'Oui' : 'Non'}
                        </td>
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.emailVerified ? 'Oui' : 'Non'}
                        </td>
                      <td className="text-center border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          {user.role}
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
                        <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                          <div >
                          <button onClick={() => handleUpdate(user)}>
                            <FaEdit className="h-5 w-5 text-primary" />
                          </button>
                          <button onClick={() => handleDelete(user.id)}>
                            <FaTrash className="h-5 w-5 text-danger" />
                          </button>
                          {user.enabled ? 
                            <button onClick={() => handleDeactivate(user.id)}>
                              <FaUserSlash className="h-5 w-5 text-warning" />
                            </button>
                          :                 
                            <button onClick={() => handleActivate(user.id)}>
                             <FaUser className="h-5 w-5 text-emerald-700" />
                            </button>
                           }
                          </div>
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
      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <DialogTitle>Mettre à jour l'utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            name="email"
            value={userToUpdate?.email || ''}
            onChange={handleUpdateChange}
            margin="dense"
            fullWidth
          />
          <TextField
            label="Prénom"
            name="firstName"
            value={userToUpdate?.firstName || ''}
            onChange={handleUpdateChange}
            margin="dense"
            fullWidth
          />
          <TextField
            label="Nom"
            name="lastName"
            value={userToUpdate?.lastName || ''}
            onChange={handleUpdateChange}
            margin="dense"
            fullWidth
          />
          <TextField
            label="Telephone"
            name="telephone"
            value={userToUpdate?.telephone || ''}
            onChange={handleUpdateChange}
            margin="dense"
            fullWidth
          />
           <FormControl fullWidth margin="normal">
      <InputLabel>Structure</InputLabel>
      <Select
    name="structure"
    value={userToUpdate?.structure?.id || ''} // Utilisation de l'ID actuel de la structure
    onChange={handleStructureChange} // Gestion du changement
  >
    {structures.map((structure) => (
      <MenuItem key={structure.id} value={structure.id}>
        {structure.name}
      </MenuItem>
    ))}
  </Select>
    </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateModalOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmitUpdate} color="primary">
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
};

export default AllUsersEvent;
