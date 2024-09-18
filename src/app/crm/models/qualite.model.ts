import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Qualite extends ResourceModel<Qualite>{
  idQualite:number;
  libelleQualite:string;

  constructor(model?: Partial<Qualite>) {
    super(model);
  }
}
