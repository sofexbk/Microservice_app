import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../axiosInstance';
import PaginationComponent from '../PaginationComponent';
import {
  TextField,
  IconButton,
  Modal,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { StructureDTO, Type } from '../../types/StructureDTO';
import { SelectChangeEvent } from '@mui/material';
const Structures: React.FC = () => {
  const [structures, setStructures] = useState<StructureDTO[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editConcours, setEditConcours] = useState<StructureDTO | null>(null);
  const [formData, setFormData] = useState<StructureDTO>({
    id: 0,
    name: '',
    type: Type.CLUB,
  });

  const fetchStructures = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/structures', {
        params: { page, size, search },
      });
      const { content, totalPages } = response.data;

      if (Array.isArray(content)) {
        setTotalPages(totalPages);
        setStructures(content);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while fetching structures data!',
      });
      setStructures([]);
    } finally {
      setLoading(false);
    }
  };
  const getTypeLabel = (type: Type): string => {
    switch (type) {
      case Type.CLUB:
        return 'CLUB';
      case Type.ASSOCIATION:
        return 'ASSOCIATION';
      case Type.ENTREPRISE:
        return 'ENTREPRISE';
      default:
        return '';
    }
  };
  
  useEffect(() => {
    fetchStructures(pageNumber, itemsPerPage, searchKeyword);
  }, [pageNumber, itemsPerPage, searchKeyword]);

  const handlePageClick = (data: { selected: number }) => {
    setPageNumber(data.selected);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cela supprimera définitivement la structure.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/structures/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'La structure a été supprimée.',
        });
        fetchStructures(pageNumber, itemsPerPage, searchKeyword); // Rafraîchir la liste
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Quelque chose s\'est mal passé lors de la suppression de la structure !',
        });
      }
    }
  };
  
  const handleUpdate = (structureItem: StructureDTO) => {
    setEditConcours(structureItem);
    setFormData(structureItem);
    setOpenModal(true);
  };
  
  const handleModalClose = () => {
    setOpenModal(false);
    setEditConcours(null);
    setFormData({ id: 0, name: '', type: Type.CLUB }); // Reset form data
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as Type; // Assurez-vous que la valeur est de type `Type`
    setFormData((prevData) => ({
      ...prevData,
      type: value,
    }));
  };
  
  

  const handleSubmit = async () => {
    if (!formData.name) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs requis manquants',
          text: 'Veuillez remplir tous les champs avant de soumettre.',
        });
        return;
      }
    try {
      if (editConcours) {
        await axiosInstance.put(`/api/structures/${formData.id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Mis à jour !',
          text: 'La structure a été mise à jour.',
        });
        setFormData({ id: 0, name: '', type: Type.CLUB });
      } else {
        await axiosInstance.post('/api/structures', formData);
        Swal.fire({
          icon: 'success',
          title: 'Ajouté !',
          text: 'La structure a été ajoutée.',
        });
        setFormData({ id: 0, name: '', type: Type.CLUB });
      }
      fetchStructures(pageNumber, itemsPerPage, searchKeyword);
      handleModalClose();
    } catch (error) {
      const axiosError = error as AxiosError;
         // Check if the response data is an object and has a 'message' property
      const errorMessage = axiosError.response?.data || 
      'Quelque chose s\'est mal passé lors de la soumission de la structure !';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: typeof errorMessage === 'string' ? errorMessage : 'Quelque chose s\'est mal passé lors de la soumission de la structure !',
      });
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center mb-4 space-x-6">
    
          <TextField
            select
            label="Items per page"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            SelectProps={{ native: true }}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Ajouter Structure" arrow>
              <IconButton
                onClick={() => {
                  setEditConcours(null);
                  setOpenModal(true);
                }}
                color="primary"
              >
                <Typography variant="body1" style={{ marginLeft: 10 }}>
                  Ajouter une structure
                </Typography>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="flex h-screen items-center justify-center bg-white">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[150px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm text-center">
                    Name
                  </th>
                  <th className="min-w-[150px] py-4 px-2 font-medium text-black dark:text-white cursor-pointer text-xs sm:text-sm text-center">
                    Type
                  </th>
                  <th className="py-4 px-2 font-medium text-black dark:text-white text-xs sm:text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {structures.length > 0 ? (
                  structures.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-2 text-xs sm:text-sm text-center">{item.name}</td>
                      <td className="py-4 px-2 text-xs sm:text-sm text-center">{item.type}</td>
                      <td className="py-4 px-2 text-xs sm:text-sm text-center">
                        <IconButton onClick={() => handleUpdate(item)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 px-2 text-center text-xs sm:text-sm">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <div className="mt-4 mb-2">
            {!loading && totalPages > 0 && (
              <PaginationComponent
                totalPages={totalPages}
                handlePageClick={handlePageClick}
                pageNumber={pageNumber}
              />
            )}
          </div>
        </div>
        <Modal open={openModal} onClose={handleModalClose}>
          <div className="p-4 bg-white border border-gray-300 rounded-md shadow-lg w-96 mx-auto mt-40">
            <h2 className="text-lg font-semibold mb-4">
              {editConcours ? 'Update Structure' : 'Add Structure'}
            </h2>
            <TextField
              label="Nom"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
                name="type"
                value={formData.type}
                onChange={handleStatusChange}
                label="Type"
            >
                {Object.values(Type).map(type => (
                <MenuItem key={type} value={type}>
                    {getTypeLabel(type as Type)}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
            <div className="flex justify-end mt-4">
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                >
                    {editConcours ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button
                    onClick={handleModalClose}
                    color="secondary"
                    variant="outlined"
                    className="ml-4" // Increase margin-left to create more space
                >
                    Annuler
                </Button>
                </div>

          </div>
        </Modal>
      </div>
    </>
  );
};

export default Structures;
