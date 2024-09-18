import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";
import {Comptecomptable} from "./comptecomptable.model";
import {Modeleecritureformule} from "./modeleecritureformule.model";

export class Modeleecriture extends  ResourceModel<Modeleecriture>{
  codeModeleEcriture: string;
  libelleModeleEcriture: string;
  modeleEcritureFormules:Modeleecritureformule[];
  constructor(model?: Partial<Modeleecriture>) {
  super(model);
}
}
