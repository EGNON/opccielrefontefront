import {BaseModel} from "./base.model";
import {Jour} from "./jour.model";
import {Alerte} from "./alerte.model";
import { ResourceModel } from "./core/resource.model";

export class JourAlerte extends ResourceModel<JourAlerte>{
  jours: Jour;
  alerte: Alerte;
  etat: boolean;

  constructor(model?: Partial<JourAlerte>) {
    super(model);
  }
}
