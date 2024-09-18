import {Monnaie} from "./monnaie.model";
import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Pays extends ResourceModel<Pays>{
  idPays:number;
  libelleFr:string;
  libelleEn:string;
  monnaieDto:Monnaie;
  indicatif:number;
  estGafi:boolean;

  constructor(model?: Partial<Pays>) {
    super(model);
  }
}
