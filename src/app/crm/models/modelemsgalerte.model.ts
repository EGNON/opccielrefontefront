import {BaseModel} from "./base.model";
import {Typemodele} from "./typemodele.model";
import {RDV} from "./rdv.model";
import { ResourceModel } from "./core/resource.model";

export class ModeleMsgAlerte extends ResourceModel<ModeleMsgAlerte>{
  idModele: number;
  objet: string;
  contenu: string;
  typeModele:Typemodele;
  defaut:boolean;
  rdvs:RDV[];

  constructor(model?: Partial<ModeleMsgAlerte>) {
    super(model);
  }
}
