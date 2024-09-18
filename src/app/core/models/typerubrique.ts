import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typerubrique extends ResourceModel<Typerubrique>{
  codeTypeRubrique: string;
  constructor(model?: Partial<Typerubrique>) {
    super(model);
  }
}
