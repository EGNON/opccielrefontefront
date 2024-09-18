import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typeib extends ResourceModel<Typeib>{
  codeTypeIb: string;
  libelleTypeIB: string;
  referencerIBSysteme:boolean;
  constructor(model?: Partial<Typeib>) {
    super(model);
  }
}
