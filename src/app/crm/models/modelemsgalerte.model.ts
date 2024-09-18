import {BaseModel} from "./base.model";
import {Typemodele} from "./typemodele.model";
import {RDV} from "./rdv.model";

export interface ModeleMsgAlerte extends BaseModel{
  idModele: number;
  objet: string;
  contenu: string;
  typeModele:Typemodele;
  defaut:boolean;
  rdvs:RDV[];
}
