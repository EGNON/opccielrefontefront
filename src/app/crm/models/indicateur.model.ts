import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Indicateur extends ResourceModel<Indicateur>{
  idIndicateur:number;
  code: string;
  libelle:string;
  
  constructor(model?: Partial<Indicateur>) {
    super(model);
  }
  
}
