import {BaseModel} from "./base.model";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";
import {Personnel} from "./personne/personnel.model";
import {Alerte} from "./alerte.model";

export interface DiffusionAlerte extends BaseModel{
  alerte: Alerte;
  modeleMsgAlerte: ModeleMsgAlerte;
  personnel: Personnel;
  statut:string;
  isShown: boolean;
  isRead: boolean;
  objet: string;
  contenu: string;
  compteur: number;
}
