import {ResourceModel} from "../../crm/models/core/resource.model";
import {Modeleecritureformule} from "./modeleecritureformule.model";

export class Formule extends ResourceModel<Formule>{
  idFormule: number;
  libelleFormule: string;
  estSysteme:boolean;
  modeleEcritureFormules:Modeleecritureformule[];
  constructor(model?: Partial<Formule>) {
    super(model);
  }
}
