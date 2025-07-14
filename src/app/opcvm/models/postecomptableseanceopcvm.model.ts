import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Plan} from "../../core/models/plan.model";

export class Postecomptableseanceopcvm extends  ResourceModel<Postecomptableseanceopcvm>{
  codePosteComptable:string;
  libellePosteComptable:string;
  idSeance:number;
  plan:Plan;
  opcvm:Opcvm;
  formuleSysteme:string;
  dateValeur:Date;
  valeur:number;
  estVerifie1:boolean;
  dateVerification1:Date;
  userLogin:string;
  userLoginVerificateur1:string;
  estVerifie2:boolean;
  dateVerification2:Date
  userLoginVerificateur2:string;

  constructor(model?: Partial<Postecomptableseanceopcvm>) {
    super(model);
  }
}
