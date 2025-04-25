// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";
import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Plan} from "../../core/models/plan.model";

export class Typeordre extends ResourceModel<Typeordre>{

  idTypeOrdre:number;
  libelleTypeOrdre:string;

  constructor(model?: Partial<Typeordre>) {
    super(model);
  }
}
