import {BaseModel} from "./base.model";
import {Personne} from "./personne/personne.model";
import {Alerte} from "./alerte.model";

export interface MessageBox extends BaseModel{
  idMsgBox: number;
  dateEnvoiMsg: Date;
  objet: string;
  contenu: any;
  time: string;
  icon: string;
  state: 'primary' | 'danger' | 'warning' | 'success' | 'info';
  destinataire: Personne;
  alerte: Alerte;
}
