import {ResourceModel} from "../../crm/models/core/resource.model";


export class Typeaction extends  ResourceModel<Typeaction>{
  idTypeAction: number;
  libelleTypeAction: string;
  codeTypeAction: string;

  constructor(model?: Partial<Typeaction>) {
  super(model);
}
}
