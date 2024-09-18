import {ResourceModel} from "../../crm/models/core/resource.model";


export class Banque extends  ResourceModel<Banque>{
  idBanque: number;
  nomBanque: string;
  codeBanque: string;

  constructor(model?: Partial<Banque>) {
  super(model);
}
}
