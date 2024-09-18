import {ResourceModel} from "../../../crm/models/core/resource.model";


export class Typeclient extends  ResourceModel<Typeclient>{
  idTypeClient: number;
  libelleTypeClient: string;
  codeTypeClient: string;

  constructor(model?: Partial<Typeclient>) {
  super(model);
}
}
