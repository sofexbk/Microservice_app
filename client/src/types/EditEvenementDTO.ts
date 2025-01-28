import { CurrentEtape } from "./EvenementDTO";

export interface EditEvenementDTO {
    comite?: string; // Optional for editing
    id?: number; // Optional if not required to be edited
    intitule?: string;
    dates?: string;
    horaires?: string;
    objectif?: string;
    soutienLogistique?: string;
    publicCible?: string[]; // Optional for editing
    affiche?: File | null; // Change from string to File
    progPrev?: File | null; // Change from string to File
    listInter?: File | null; // Change from string to File
    documentAutorite?: File | null; // Change from string to File
    compteRendu?: string; // Optional for editing
    deadline?: number; // Optional for editing
    structureId?: number; // Optional if not required to be edited
    structureName?: number; // Optional if not required to be edited
    presidentId?: number; // Optional if not required to be edited
    dateCompteRendu?: string | null; // Optional
    dateValidationParrain?: string | null; // Optional
    createdAt?: string; // Optional for editing
    currentEtape?: CurrentEtape; // Optional for editing
  }
  