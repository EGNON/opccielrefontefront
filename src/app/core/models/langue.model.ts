import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";
import {Comptecomptable} from "./comptecomptable.model";
import {Pays} from "../../crm/models/pays.model";
import {Payslangue} from "./payslangue.model";

export class Langue extends  ResourceModel<Langue>{
  idLangue:number;
  codeLangue: string;
  libelleLangue: string;
  paysLangues:Payslangue[];
  constructor(model?: Partial<Langue>) {
    super(model);
  }
}
