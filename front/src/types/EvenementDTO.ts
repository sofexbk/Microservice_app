export interface EvenementDTO {
  comite: string;
  id: number;
  intitule: string;
  dates: [''];
  horaires: [''];
  objectif: string;
  soutienLogistique: string;
  publicCible: string[];
  affiche: string;
  progPrev: string;
  listInter: string;
  documentAutorite: string;
  compteRendu?: string;
  deadline: number;
  structureId: number;
  structureName: string;
  presidentId: number;
  presidentName: string;
  dateCompteRendu?: string | null;
  dateValidationParrain?: string | null;
  createdAt: string;
  currentEtape?: CurrentEtape;
  structure: string;
}
export interface CurrentEtape {
  status: string; 
  niveau: string;
  motifRefus: string | null; 
}