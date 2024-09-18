// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";

export interface Ratiosharp extends BaseModel{
  dateFermeture:Date;
  vl:number;
  dividendeDistribue:number;
  performanceAnnuelle:number;
  volatiliteAnnualisee:number;
  sharp:number;
}
