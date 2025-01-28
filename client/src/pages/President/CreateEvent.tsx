import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Box, Typography, Select, MenuItem, FormControl, InputLabel, TextareaAutosize } from '@mui/material';
import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../security/JwtDecoder';
import { FaTrash } from 'react-icons/fa';

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


const CreateEvent: React.FC = () => {
  const [structureId, setStructureId] = useState<number | null>(null);
  const [presidentId, setPresidentId] = useState<number | null>(null);
  const navigate=useNavigate();
  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 Mo
  const [loading, setLoading] = useState(false);
  const ALLOWED_FILE_TYPES = ['application/pdf'];
  const validateFile = (file: File | null) => {
    if (!file) return true; // No file selected, no error
  
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({
        icon: 'error',
        title: 'Fichier trop volumineux',
        text: `Le fichier "${file.name}" dépasse la taille maximale autorisée de 30 Mo.`,
        confirmButtonText: 'OK',
      });
      return false; // File too large
    }
  
    // Check file type
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
    if (!isValidType) {
      Swal.fire({
        icon: 'error',
        title: 'Type de fichier invalide',
        text: `Le fichier "${file.name}" est invalide. Types autorisés : ${ALLOWED_FILE_TYPES.join(', ')}`,
        confirmButtonText: 'OK',
      });
      return false; // Invalid file type
    }
  
    return true; // Valid file
  };
  useEffect(() => {
    const user = getUser();
    if (user && user.userId) {
      setPresidentId(user.userId);
      setStructureId(user.structure?.id ?? null);
    }
  }, []);
  const validateFiles = (files: { [key: string]: File | null }) => {
    for (const key in files) {
      const file = files[key];
      if (file && file.size > MAX_FILE_SIZE) {
        return `Le fichier ${key} dépasse la taille maximale autorisée de 30 Mo.`;
      }
    }
    return null;
  };
  
  const formik = useFormik({
    initialValues: {
      dates: [''], // Array for multiple dates
      horaires: [''], // Array for multiple horaires
      objectif: '',
      intitule:'',
      soutienLogistique: '',
      publicCible: [] as PublicCible[],
      comite: '',
      affiche: null as File | null,
      progPrev: null as File | null,
      listInter: null as File | null,
      documentAutorite: null as File | null,
    },
    validationSchema: Yup.object({
      intitule: Yup.string().required('L\'intitulé est requis'),
      dates: Yup.array().of(Yup.string().required('La date est requise')),
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
      comite: Yup.string() .required('Le comité est requis'),
      affiche: Yup.mixed().required('L\'affiche est requise'),
      progPrev: Yup.mixed().required('Le programme prévisionnel est requis'),
      listInter: Yup.mixed().required('La liste des intervenants est requise'),
      
    }),
    onSubmit: async (values, { resetForm }) => {
      const fileError = validateFiles({
        affiche: values.affiche,
        progPrev: values.progPrev,
        listInter: values.listInter,
        documentAutorite: values.documentAutorite,
      });
    
      if (fileError) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: fileError,
          confirmButtonText: 'OK',
        });
        return;
      }
    
      // Validation des dates et horaires avant l'envoi
      if (values.dates.length === 0 || values.dates.every(date => !date) || 
          values.horaires.length === 0 || values.horaires.every(horaire => !horaire)) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Veuillez fournir au moins une date et un horaire avant de soumettre.',
          confirmButtonText: 'OK'
        });
        return; // Ne pas envoyer les données si la validation échoue
      }
      const confirmResult = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment soumettre cet événement ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, soumettre !',
        cancelButtonText: 'Annuler'
      });

      if (confirmResult.isConfirmed) {
        setLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item.toString()));
          } else if (value instanceof File) {
            formData.append(key, value);
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
          const response = await axiosInstance.post('/api/evenements', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: response.data,
            confirmButtonText: 'OK'
          });
          resetForm();
          navigate("/president/events");
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.response?.data || 'Une erreur est survenue',
            confirmButtonText: 'OK'
          });
        }finally {
          setLoading(false); // Arrêter le chargement
        }
      }
    },
  });
  
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
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        p: 4,
        backgroundColor: '#f7f7f7',
        borderRadius: '8px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          mb: 4,
          color: '#294A70',
          fontWeight: 'bold', // Met le texte en gras
          textTransform: 'uppercase' // Met le texte en majuscules
        }}
      >        
      Créer un Événement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="intitule"
            name="intitule"
            label="Intitulé"
            value={formik.values.intitule}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.intitule && Boolean(formik.errors.intitule)}
            helperText={formik.touched.intitule && formik.errors.intitule}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="publicCible-label">Public Cible</InputLabel>
            <Select
              labelId="publicCible-label"
              id="publicCible"
              name="publicCible"
              multiple
              value={formik.values.publicCible}
              onChange={(event) => formik.setFieldValue('publicCible', event.target.value)}
              onBlur={formik.handleBlur}
              renderValue={(selected) => (selected as PublicCible[]).join(', ')}
            >
              {Object.values(PublicCible).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.publicCible && formik.errors.publicCible && (
              <Typography color="error" variant="body2">{formik.errors.publicCible}</Typography>
            )}
          </FormControl>
        </Grid>
        {/* Multiple Dates Input */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Dates:</Typography>
          {formik.values.dates.map((date, index) => (
          <Grid container spacing={1} key={`date-${index}`} sx={{ mb: 2 }}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                id={`dates-${index}`}
                name={`dates-${index}`}
                label={`Date ${index + 1}`}
                type="date"
                value={date}
                onChange={(event) => handleDateChange(index, event.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.dates && Boolean(formik.errors.dates?.[index])}
                helperText={formik.touched.dates && formik.errors.dates?.[index]}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={() => removeDate(index)}
                variant="outlined"
                color="error"
                sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                 <FaTrash />
              </Button>
            </Grid>
          </Grid>
        ))}
          <Button
            onClick={addDate}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Ajouter une Date
          </Button>
        </Grid>

        {/* Multiple Horaires Input */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Horaires:</Typography>
          {formik.values.horaires.map((horaire, index) => (
          <Grid container spacing={1} key={`horaire-${index}`} sx={{ mb: 2 }}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                id={`horaires-${index}`}
                name={`horaires-${index}`}
                label={`Horaire ${index + 1}`}
                value={horaire}
                onChange={(event) => handleHoraireChange(index, event.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.horaires && Boolean(formik.errors.horaires?.[index])}
                helperText={formik.touched.horaires && formik.errors.horaires?.[index]}
              />
            </Grid>
            <Grid item xs={2}>
            <Button
          onClick={() => removeHoraire(index)}
          variant="outlined"
          color="error"
          sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <FaTrash />
        </Button>
            </Grid>
          </Grid>
        ))}
          <Button
            onClick={addHoraire}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Ajouter un Horaire
          </Button>
        </Grid>
        
         <Grid item xs={12} md={4} >
          <TextareaAutosize
            minRows={4}
            id="comite"
            name="comite"
            value={formik.values.comite}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Comité : Exemple: 2 Noms et Prénoms (puis sauter ligne), 2 emails (puis sauter ligne) , 2 numéros"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <Typography variant="body2" color="textSecondary">
            Veuillez entrer les informations de deux personnes du comité 
          </Typography>
          {formik.touched.comite && formik.errors.comite && (
            <Typography color="error" variant="body2">{formik.errors.comite}</Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextareaAutosize
            minRows={4}
            id="objectif"
            name="objectif"
            placeholder="Objectif"
            value={formik.values.objectif}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <Typography variant="body2" color="textSecondary">
            Veuillez entrer l'objectif d'évenement
          </Typography>
          {formik.touched.objectif && formik.errors.objectif && (
            <Typography color="error" variant="body2">{formik.errors.objectif}</Typography>
          )}
        </Grid>
        <Grid item xs={12}  md={4}>
          <TextareaAutosize
            minRows={4}
            id="soutienLogistique"
            name="soutienLogistique"
            placeholder="Soutien Logistique"
            value={formik.values.soutienLogistique}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <Typography variant="body2" color="textSecondary">
          * Le soutien logistique ne concerne pas le soutien financier.
          </Typography>
          {formik.touched.soutienLogistique && formik.errors.soutienLogistique && (
            <Typography color="error" variant="body2">{formik.errors.soutienLogistique}</Typography>
          )}
        </Grid>
     
        <Grid item xs={12} md={6}>
            <Button
            variant="contained"
            component="label"
            fullWidth
            >
            Importer Affiche
            <input
                type="file"
                id="affiche"
                name="affiche"
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  if (validateFile(file)) { // Only set the value if validation passes
                    formik.setFieldValue('affiche', file);
                  } else {
                    event.currentTarget.value = ""; // Clear input if invalid
                  }
                }}
            />
            </Button>
            {formik.values.affiche && (
            <Typography variant="body2">Fichier sélectionné : {formik.values.affiche.name}</Typography>
            )}
            {formik.touched.affiche && formik.errors.affiche && (
            <Typography color="error" variant="body2">{formik.errors.affiche}</Typography>
            )}
            </Grid>

            <Grid item xs={12} md={6}>
            <Button
            variant="contained"
            component="label"
            fullWidth
            >
            Importer Programme Prévisionnel
            <input
                type="file"
                id="progPrev"
                name="progPrev"
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  if (validateFile(file)) { // Only set the value if validation passes
                    formik.setFieldValue('progPrev', file);
                  } else {
                    event.currentTarget.value = ""; // Clear input if invalid
                  }
                }}
            />
            </Button>
            {formik.values.progPrev && (
            <Typography variant="body2">Fichier sélectionné : {formik.values.progPrev.name}</Typography>
            )}
            {formik.touched.progPrev && formik.errors.progPrev && (
            <Typography color="error" variant="body2">{formik.errors.progPrev}</Typography>
            )}
            </Grid>

            <Grid item xs={12} md={6}>
            <Button
            variant="contained"
            component="label"
            fullWidth
            >
            Importer Liste des Intervenants
            <input
                type="file"
                id="listInter"
                name="listInter"
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  if (validateFile(file)) { // Only set the value if validation passes
                    formik.setFieldValue('listInter', file);
                  } else {
                    event.currentTarget.value = ""; // Clear input if invalid
                  }
                }}
            />
            </Button>
            {formik.values.listInter && (
            <Typography variant="body2">Fichier sélectionné : {formik.values.listInter.name}</Typography>
            )}
            {formik.touched.listInter && formik.errors.listInter && (
            <Typography color="error" variant="body2">{formik.errors.listInter}</Typography>
            )}
            </Grid>

            <Grid item xs={12} md={6}>
            <Button
            variant="contained"
            component="label"
            fullWidth
            >
            Importer Document d'Autorité
            <input
                type="file"
                id="documentAutorite"
                name="documentAutorite"
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  if (validateFile(file)) { // Only set the value if validation passes
                    formik.setFieldValue('documentAutorite', file);
                  } else {
                    event.currentTarget.value = ""; // Clear input if invalid
                  }
                }}
            />
            </Button>
            <Typography variant="body2" color="textSecondary">
              * Joindre si nécessaire 
            </Typography>
            {formik.values.documentAutorite && (
              
            <Typography variant="body2">Fichier sélectionné : {formik.values.documentAutorite.name}</Typography>
            )}
   
            </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} >
          {loading ? "En cours de soumission..." : "Soumettre"}

          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateEvent;
