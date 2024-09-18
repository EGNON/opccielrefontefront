import {ResourceModel} from "../../crm/models/core/resource.model";
import {Modeleecriture} from "./modeleecriture.model";
import {Formule} from "./formule";

export class Detailmodele extends  ResourceModel<Detailmodele>{
  modeleEcriture: Modeleecriture;
  formule: Formule;
  numCompteComptable:string;
  numeroOrdre:number;
  sensMvt:string;
  constructor(model?: Partial<Detailmodele>) {
    super(model);
  }
}
