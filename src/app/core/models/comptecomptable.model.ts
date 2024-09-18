import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";


export class Comptecomptable extends  ResourceModel<Comptecomptable>{
  numCompteComptable:string;
  plan:Plan;
  libelleCompteComptable:string;
  sensMvt:string;
  estMvt:boolean;
  bilanHorsBilan:string;
  type:string;
  constructor(model?: Partial<Comptecomptable>) {
  super(model);
}
}
