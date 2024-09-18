import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";


export class CleComptecomptable extends  ResourceModel<CleComptecomptable>{
  numCompteComptable:string;
  codePlan:string;
  constructor(model?: Partial<CleComptecomptable>) {
  super(model);
}
}
