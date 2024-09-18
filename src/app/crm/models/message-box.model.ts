import {BaseModel} from "./base.model";
import {Personne} from "./personne/personne.model";
import {Alerte} from "./alerte.model";
import { ResourceModel } from "./core/resource.model";

export class MessageBox extends ResourceModel<MessageBox>{
  idMsgBox: number;
  dateEnvoiMsg: Date;
  objet: string;
  contenu: any;
  time: string;
  icon: string;
  state: 'primary' | 'danger' | 'warning' | 'success' | 'info';
  destinataire: Personne;
  alerte: Alerte;

  constructor(model?: Partial<MessageBox>) {
    super(model);
  }
}
