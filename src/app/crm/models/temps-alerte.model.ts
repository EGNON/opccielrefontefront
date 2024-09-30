import {BaseModel} from "./base.model";
import {Alerte} from "./alerte.model";
import {Temps} from "./temps.model";
import {Time} from "@angular/common";
import { ResourceModel } from "./core/resource.model";

export class TempsAlerte extends ResourceModel<TempsAlerte>{
  alerte: Alerte;
  temps: Temps;
  frequence: number;
  heureDebut: Time;
  heureFin: Time;

  constructor(model?: Partial<TempsAlerte>) {
    super(model);
  }
}
