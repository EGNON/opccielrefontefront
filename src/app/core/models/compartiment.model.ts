import {ResourceModel} from "../../crm/models/core/resource.model";

export class Compartiment extends  ResourceModel<Compartiment>{
  idCompartiment: number;
  libelleCompartiment: string;

  constructor(model?: Partial<Compartiment>) {
    super(model);
  }
}
