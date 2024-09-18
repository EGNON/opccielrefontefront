import {BaseModel} from "./base.model";
import {Personne} from "./personne/personne.model";
import {Qualite} from "./qualite.model";
import {Personnel} from "./personne/personnel.model";
import { ResourceModel } from "./core/resource.model";

export class StatutPersonne extends ResourceModel<StatutPersonne>{
  idStatutPersonne: any;
  personne: Personne;
  qualite: Qualite | null | undefined;
  personnel: Personnel | null | undefined;

  constructor(model?: Partial<StatutPersonne>) {
    super(model);
  }
}
