// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";

export interface CorrelationModel extends BaseModel{
  dateFermeture:Date;
  vl:number;
  nav:number;
  performancePortefeuille:number;
  performanceBenchMark:number;
  correlation:number;
}
