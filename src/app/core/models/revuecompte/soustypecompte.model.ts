import {ResourceModel} from "../../../crm/models/core/resource.model";
import {Typecompte} from "./typecompte.model";

export class Soustypecompte extends ResourceModel<Soustypecompte>{
  idSousTypeCompte: number;
  libelleSousTypeCompte: string;
  codeSousTypeCompte: string;
  typeCompte:Typecompte;
  constructor(model?: Partial<Soustypecompte>) {
    super(model);
  }
}
