import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typeoperation extends  ResourceModel<Typeoperation>{
  codeTypeOperation: string;
  libelleTypeOperation: string;

  constructor(model?: Partial<Typeoperation>) {
  super(model);
}
}
