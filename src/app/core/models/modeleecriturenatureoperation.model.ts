import {ResourceModel} from "../../crm/models/core/resource.model";
import {Modeleecriture} from "./modeleecriture.model";
import {Natureoperation} from "./natureoperation.model";
import {Typetitre} from "./typetitre.model";

export class Modeleecriturenatureoperation extends  ResourceModel<Modeleecriturenatureoperation>{
  idModeleEcritureNatureOperation:number;
  modeleEcriture: Modeleecriture;
  natureOperation: Natureoperation;
  numeroOrdre:number;
  typeTitre:Typetitre;
  constructor(model?: Partial<Modeleecriturenatureoperation>) {
    super(model);
  }
}
