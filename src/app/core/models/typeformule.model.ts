import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typeformule extends  ResourceModel<Typeformule>{
  codeTypeFormule: string;

  constructor(model?: Partial<Typeformule>) {
  super(model);
}
}
