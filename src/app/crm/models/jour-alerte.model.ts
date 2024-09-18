import {BaseModel} from "./base.model";
import {Jour} from "./jour.model";
import {Alerte} from "./alerte.model";

export interface JourAlerte extends BaseModel{
  jours: Jour;
  alerte: Alerte;
  etat: boolean;
}
