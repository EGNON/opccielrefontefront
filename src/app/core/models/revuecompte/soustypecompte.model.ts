import {ResourceModel} from "../../../crm/models/core/resource.model";
import {Typecompte} from "./typecompte.model";

export class Soustypecompte extends ResourceModel<Soustypecompte>{
  idSousTypeCompte: number;
  intitule: string;
  code: string;
  typeCompte:Typecompte;
  constructor(model?: Partial<Soustypecompte>) {
    super(model);
  }
}
