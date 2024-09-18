import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";
import {Comptecomptable} from "./comptecomptable.model";
import {Modeleecriture} from "./modeleecriture.model";
import {Formule} from "./formule";

export class Modeleecritureformule extends  ResourceModel<Modeleecritureformule>{
  modeleEcriture: Modeleecriture;
  formule: Formule;
  constructor(model?: Partial<Modeleecritureformule>) {
  super(model);
}
}
