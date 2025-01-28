export interface StructureDTO {
    id: number ;
    name:string;
    type:Type;
}
export enum Type {
  CLUB = 'CLUB',
  ASSOCIATION = 'ASSOCIATION',
  ENTREPRISE = 'ENTREPRISE'
}
