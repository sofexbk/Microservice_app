import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import axiosInstance from '../../axiosInstance'; // Assurez-vous d'importer votre instance Axios
import { getUser } from '../security/JwtDecoder';

interface EvenementDTO {
  id: number;
  intitule: string;
  dates: [''];
  horaires: [''];
  objectif: string;
  comite: string;
  soutienLogistique: string;
  publicCible: string[];
}
enum PublicCible {
  AP = "AP",
  CYCLE = "CYCLE",
  INTERNE = "INTERNE",
  EXTERNE = "EXTERNE",
  AP1 = "AP1",
  AP2 = "AP2",
  GINF = "GINF",
  CSI = "CSI",
  GIND = "GIND",
  GSEA = "GSEA",
  G2EI = "G2EI",
  GSR = "GSR",
  GINF1 = "GINF1",
  GINF2 = "GINF2",
  GINF3 = "GINF3",
  CSI1 = "CSI1",
  CSI2 = "CSI2",
  CSI3 = "CSI3",
  GIND1 = "GIND1",
  GIND2 = "GIND2",
  GIND3 = "GIND3",
  GSEA1 = "GSEA1",
  GSEA2 = "GSEA2",
  GSEA3 = "GSEA3",
  G2EI1 = "G2EI1",
  G2EI2 = "G2EI2",
  G2EI3 = "G2EI3",
  GSR1 = "GSR1",
  GSR2 = "GSR2",
  GSR3 = "GSR3",
  MPSI = "MPSI",
  MBISD = "MBISD"
}



interface EditEventModalProps {
  open: boolean;
  onClose: () => void;
  evenement: EvenementDTO | null;
  fetchEvent: (pageNumber: number, itemsPerPage: number, searchTerm: string) => void;
  pageNumber: number;
  itemsPerPage: number;
  searchTerm: string;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ open, onClose, evenement, fetchEvent, pageNumber, itemsPerPage, searchTerm }) => {
  const [structureId, setStructureId] = useState<number | null>(null);
  const [presidentId, setPresidentId] = useState<number | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user && user.userId) {
      setPresidentId(user.userId);
      setStructureId(user.structure?.id ?? null);
    }
  }, []);
 
  
  const formik = useFormik({
    initialValues: {
      id: evenement?.id || 0,
      intitule: evenement?.intitule || '',
      dates: evenement?.dates || [''],
      horaires: evenement?.horaires || [''],
      objectif: evenement?.objectif || '',
      comite: evenement?.comite || '',
      soutienLogistique: evenement?.soutienLogistique || '',
      publicCible: evenement?.publicCible || []
    },
    validationSchema: Yup.object({
      intitule: Yup.string().required('L\'intitulé est requis'),
      dates: Yup.array().of(Yup.string().required('La date est requise')).min(1, 'Veuillez ajouter au moins une date'),
      horaires: Yup.array()
        .of(
          Yup.string()
            .matches(/^De \d{1,2}:\d{2} à \d{1,2}:\d{2}$/, 'L\'horaire doit être au format "De HH:MM à HH:MM"')
            .required('L\'horaire est requis')
        )
        .required('Les horaires sont requis'),
      objectif: Yup.string().required('L\'objectif est requis'),
      soutienLogistique: Yup.string().required('Le soutien logistique est requis'),
      publicCible: Yup.array().min(1, 'Veuillez sélectionner au moins un public cible').required('Le public cible est requis'),
      comite: Yup.string().required('Le comité est requis')
    }),
    onSubmit: async (values) => {
      

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item.toString()));
        } else {
          formData.append(key, value as any);
        }
      });
      if (presidentId !== null) {
        formData.append('presidentId', presidentId.toString());
      }
      if (structureId !== null) {
        formData.append('structureId', structureId.toString());
      }

      try {
        await axiosInstance.put(`/api/evenements/update/${values.id}`, formData);
        Swal.fire({
          title: 'Succès',
          text: 'Les informations de l\'événement ont été mises à jour.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        fetchEvent(pageNumber, itemsPerPage, searchTerm);
        onClose(); // Fermer le modal
      } catch (error: any) {
        Swal.fire({
          title: 'Erreur',
          text: error.response?.data || 'Une erreur est survenue',
          icon: 'error',
          confirmButtonText: 'OK',
          
        });
      }
    },
  });

  useEffect(() => {
    if (evenement) {
      formik.setValues({
        id: evenement.id,
        intitule: evenement.intitule,
        dates: evenement.dates,
        horaires: evenement.horaires,
        objectif: evenement.objectif,
        comite: evenement.comite,
        soutienLogistique: evenement.soutienLogistique,
        publicCible: evenement.publicCible,
      });
    }
  }, [evenement]);
  const addDate = () => {
    formik.setFieldValue('dates', [...formik.values.dates, '']);
  };

  const removeDate = (index: number) => {
    formik.setFieldValue('dates', formik.values.dates.filter((_, i) => i !== index));
  };

  const addHoraire = () => {
    formik.setFieldValue('horaires', [...formik.values.horaires, '']);
  };

  const removeHoraire = (index: number) => {
    formik.setFieldValue('horaires', formik.values.horaires.filter((_, i) => i !== index));
  };

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...formik.values.dates];
    newDates[index] = value;
    formik.setFieldValue('dates', newDates);
  };

  const handleHoraireChange = (index: number, value: string) => {
    const newHoraires = [...formik.values.horaires];
    newHoraires[index] = value;
    formik.setFieldValue('horaires', newHoraires);
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier l'Événement</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Intitulé"
            name="intitule"
            value={formik.values.intitule}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
        <Grid item xs={12}>
          <Typography variant="h6">Dates</Typography>
          {formik.values.dates.map((date, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  value={date}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  onBlur={() => formik.setFieldTouched('dates', true)}
                  placeholder="Date"
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" color="error" onClick={() => removeDate(index)}>
                  Supprimer
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={addDate}>
            Ajouter une Date
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Horaires</Typography>
          {formik.values.horaires.map((horaire, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  value={horaire}
                  onChange={(e) => handleHoraireChange(index, e.target.value)}
                  onBlur={() => formik.setFieldTouched('horaires', true)}
                  placeholder="De HH:MM à HH:MM"
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" color="error" onClick={() => removeHoraire(index)}>
                  Supprimer
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={addHoraire}>
            Ajouter un Horaire
          </Button>
        </Grid>
          <TextField
            label="Objectif"
            name="objectif"
            value={formik.values.objectif}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Comité"
            name="comite"
            value={formik.values.comite}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Soutien Logistique"
            name="soutienLogistique"
            value={formik.values.soutienLogistique}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
         <FormControl fullWidth margin="normal">
            <InputLabel>Public Ciblé</InputLabel>
            <Select
              label="Public Ciblé"
              name="publicCible"
              value={formik.values.publicCible}
              multiple
              onChange={(e) => formik.setFieldValue('publicCible', e.target.value)}
            >
              {Object.values(PublicCible).map((cible) => (
                <MenuItem key={cible} value={cible}>
                  {cible}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Annuler
            </Button>
            <Button type="submit" color="primary">
              Sauvegarder
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
