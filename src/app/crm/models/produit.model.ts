import {BaseModel} from "./base.model";

export interface Produit extends BaseModel{
  idProd:number;
  designation:string;
}
