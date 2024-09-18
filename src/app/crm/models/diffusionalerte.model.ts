import {BaseModel} from "./base.model";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";
import {Personnel} from "./personne/personnel.model";
import {Alerte} from "./alerte.model";
import { ResourceModel } from "./core/resource.model";

export class DiffusionAlerte extends ResourceModel<DiffusionAlerte>{
  alerte: Alerte;
  modeleMsgAlerte: ModeleMsgAlerte;
  personnel: Personnel;
  statut:string;
  isShown: boolean;
  isRead: boolean;
  objet: string;
  contenu: string;
  compteur: number;

  constructor(model?: Partial<DiffusionAlerte>) {
    super(model);
  }
}
