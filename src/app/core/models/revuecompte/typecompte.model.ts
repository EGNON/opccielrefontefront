import {ResourceModel} from "../../../crm/models/core/resource.model";


export class Typecompte extends  ResourceModel<Typecompte>{
  idTypeCompte: number;
  libelleTypeCompte: string;
  codeTypeCompte: string;

  constructor(model?: Partial<Typecompte>) {
  super(model);
}
}
