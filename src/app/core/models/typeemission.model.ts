import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typeemission extends  ResourceModel<Typeemission>{
  idTypeEmission: number;
  libelleTypeEmission: string;

  constructor(model?: Partial<Typeemission>) {
    super(model);
  }
}
