import {ResourceModel} from "../../../crm/models/core/resource.model";


export class Typeclient extends  ResourceModel<Typeclient>{
  idTypeClient: number;
  intitule: string;
  code: string;

  constructor(model?: Partial<Typeclient>) {
  super(model);
}
}
