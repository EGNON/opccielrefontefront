import {BaseModel} from "./base.model";
import {Categorie} from "./categorie.model";
import {Periodicite} from "./periodicite.model";
import {Indicateur} from "./indicateur.model";

export interface DetailObjectif extends BaseModel{
  idDetail: any;
  categoriePersonne: Categorie;
  periodicite: Periodicite;
  indicateur: Indicateur;
  value: number;
}
