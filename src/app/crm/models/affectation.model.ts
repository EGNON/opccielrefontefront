import {BaseModel} from "./base.model";
import {Personnel} from "./personne/personnel.model";
import {ObjectifAffecte} from "./objectif-affecte.model";

export interface Affectation extends BaseModel{
  idAffectation: number;
  dateAffectation: Date;
  dateSoumission: Date;
  personnel: Personnel;
  objectifAffectes: ObjectifAffecte[];
}
