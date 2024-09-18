import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";

export class Postecomptable extends  ResourceModel<Postecomptable>{
  codePosteComptable: string;
  libellePosteComptable: string;
  plan:Plan;
  type:string;
  formule:string;

  constructor(model?: Partial<Postecomptable>) {
    super(model);
  }
}
