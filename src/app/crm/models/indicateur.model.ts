import {BaseModel} from "./base.model";

export interface Indicateur extends BaseModel{
  idIndicateur:number;
  code: string;
  libelle:string;
}
