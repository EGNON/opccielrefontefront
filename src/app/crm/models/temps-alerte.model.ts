import {BaseModel} from "./base.model";
import {Alerte} from "./alerte.model";
import {Temps} from "./temps.model";
import {Time} from "@angular/common";

export interface TempsAlerte extends BaseModel{
  alerte: Alerte;
  temps: Temps;
  frequence: number;
  heureDebut: Time;
  heureFin: Time;
}
