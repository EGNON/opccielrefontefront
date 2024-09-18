import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typeemetteur extends  ResourceModel<Typeemetteur>{
  codeTypeEmetteur: string;
  libelleTypeEmetteur: string;

  constructor(model?: Partial<Typeemetteur>) {
  super(model);
}
}
