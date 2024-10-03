import {ResourceModel} from "../../../crm/models/core/resource.model";

export class Typecompte extends  ResourceModel<Typecompte>{
  idTypeCompte: number;
  intitule: string;
  code: string;

  constructor(model?: Partial<Typecompte>) {
  super(model);
}
}
