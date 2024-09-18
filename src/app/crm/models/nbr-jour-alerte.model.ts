import {BaseModel} from "./base.model";
import {NbrJour} from "./nbr-jour.model";
import {Alerte} from "./alerte.model";
import {Time} from "@angular/common";
import { ResourceModel } from "./core/resource.model";

export class NbreJoursAlerte extends ResourceModel<NbreJoursAlerte>{
  nbreJours: NbrJour;
  alerte: Alerte;
  heureJoursAlerte: Time;

  constructor(model?: Partial<NbreJoursAlerte>) {
    super(model);
  }
}
