import {BaseModel} from "./base.model";
import {NbrJour} from "./nbr-jour.model";
import {Alerte} from "./alerte.model";
import {Time} from "@angular/common";

export interface NbreJoursAlerte extends BaseModel{
  nbreJours: NbrJour;
  alerte: Alerte;
  heureJoursAlerte: Time;
}
