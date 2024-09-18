import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";
import {Comptecomptable} from "./comptecomptable.model";

export class Journal extends  ResourceModel<Journal>{
  codeJournal: string;
  libelleJournal: string;
  numCompteComptable:string;
  plan:Plan;
  compteComptable:Comptecomptable;
  constructor(model?: Partial<Journal>) {
  super(model);
}
}
