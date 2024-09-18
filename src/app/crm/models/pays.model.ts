import {Monnaie} from "./monnaie.model";
import {BaseModel} from "./base.model";

export interface Pays extends BaseModel{
  idPays:number;
  libelleFr:string;
  libelleEn:string;
  monnaieDto:Monnaie;
  indicatif:number;
  estGafi:boolean;
}
