import {ResourceModel} from "../../crm/models/core/resource.model";
export class CritereAlerte extends ResourceModel<CritereAlerte>{
  idCritereAlerte:number;
  dateAlerte:Date;
  etat:string;
  expression:string;
  description:string;
  sql:string;
  route:string;
  constructor(model?: Partial<CritereAlerte>) {
    super(model);
  }
}
