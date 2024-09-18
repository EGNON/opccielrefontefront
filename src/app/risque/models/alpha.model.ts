// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";

export interface Alpha extends BaseModel{
  dateFermeture:Date;
  vl:number;
  dividendeDistribue:number;
  performanceAnnuelle:number;
  indiceReference:number;
  alpha:number;
}
