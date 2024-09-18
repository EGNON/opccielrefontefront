import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Periodicite extends ResourceModel<Periodicite>{
  idPeriodicite:number;
  libelle:string;

  constructor(model?: Partial<Periodicite>) {
    super(model);
  }
}
