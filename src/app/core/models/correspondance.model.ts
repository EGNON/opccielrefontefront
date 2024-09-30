import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";
import {Ib} from "./ib";

export class Correspondance extends  ResourceModel<Correspondance>{
  numeroCompteComptable:string;
  plan:Plan;
  ib:Ib;
  codeRubrique:string;
  codePosition:string;
  libellePosition:string;

  constructor(model?: Partial<Correspondance>) {
    super(model);
  }
}
