import {ResourceModel} from "../../crm/models/core/resource.model";
export class Opcvm extends ResourceModel<Opcvm>{
  idOpcvm:number;
  dateProchainCalculVL:Date;
  denominationOpcvm:string;
  valeurLiquidativeActuelle:number;
  tauxRendement:number;
  constructor(model?: Partial<Opcvm>) {
    super(model);
  }
}
