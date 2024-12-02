// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";
import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Plan} from "../../core/models/plan.model";

export class Exercice extends ResourceModel<Exercice>{
  codeExercice:number;
  opcvm:Opcvm;
  dateDebut:Date;
  dateFin:Date;
  plan:Plan;
  estCourant:boolean;
  estFerme:boolean;
  estBloque:boolean;
  dateCloture:Date;
  tauxBenefice:number;
  montantMinimum:number;
  declassement:string;


  constructor(model?: Partial<Exercice>) {
    super(model);
  }
}
