import {ResourceModel} from "../../crm/models/core/resource.model";

export class CleComptecomptable extends  ResourceModel<CleComptecomptable>{
  numCompteComptable:string;
  codePlan:string;
  constructor(model?: Partial<CleComptecomptable>) {
  super(model);
}
}
