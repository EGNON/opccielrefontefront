import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typegarant extends  ResourceModel<Typegarant>{
  idTypeGarant: number;
  codeTypeGarant: string;
  libelleTypeGarant: string;

  constructor(model?: Partial<Typegarant>) {
    super(model);
  }
}
