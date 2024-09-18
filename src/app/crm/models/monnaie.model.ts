import {BaseModel} from "./base.model";

export interface Monnaie extends BaseModel{
  codeMonnaie: string;
  nom: string;
}
