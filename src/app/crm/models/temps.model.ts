import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Temps extends ResourceModel<Temps>{
  idTemps: number;
  libelle: string;

  constructor(model?: Partial<Temps>) {
    super(model);
  }
}
