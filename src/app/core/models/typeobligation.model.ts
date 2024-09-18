import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typeobligation extends  ResourceModel<Typeobligation>{
  idTypeObligation: number;
  codeTypeObligation: string;
  libelleTypeObligation: string;

  constructor(model?: Partial<Typeobligation>) {
  super(model);
}
}
