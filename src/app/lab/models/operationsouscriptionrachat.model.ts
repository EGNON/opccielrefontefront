// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";

export interface Operationsouscriptionrachat extends BaseModel{
  IdOperation:number;
  codeNatureOperation:string;
  dateOperation:Date;
  montantDepose:number;
  total:number;
  denomination:string;
  denominationOpcvm:string;
  nomPersonnePhysique:string;
  prenomPersonnePhysique:string;
  libelleNatureOperation:string;
  datePremiereSouscription:Date;
}
