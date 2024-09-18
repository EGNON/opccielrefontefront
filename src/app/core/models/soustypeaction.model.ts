import {ResourceModel} from "../../crm/models/core/resource.model";

export class Soustypeaction extends  ResourceModel<Soustypeaction>{
  idSousTypeAction: number;
  libelleSousTypeAction: string;
  codeSousTypeAction: string;

  constructor(model?: Partial<Soustypeaction>) {
    super(model);
  }
}
