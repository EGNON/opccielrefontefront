import {BaseModel} from "./base.model";
import {Categorie} from "./categorie.model";
import {Periodicite} from "./periodicite.model";
import {Indicateur} from "./indicateur.model";
import { ResourceModel } from "./core/resource.model";

export class DetailObjectif extends ResourceModel<DetailObjectif>{
  idDetail: any;
  categoriePersonne: Categorie;
  periodicite: Periodicite;
  indicateur: Indicateur;
  value: number;

  constructor(model?: Partial<DetailObjectif>) {
    super(model);
  }
}
