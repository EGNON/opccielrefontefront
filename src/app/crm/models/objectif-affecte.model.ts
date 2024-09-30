import {BaseModel} from "./base.model";
import {ModeleObjectif} from "./modele-objectif.model";
import {Categorie} from "./categorie.model";
import {Indicateur} from "./indicateur.model";
import {Periodicite} from "./periodicite.model";
import {Affectation} from "./affectation.model";
import { ResourceModel } from "./core/resource.model";

export class ObjectifAffecte extends ResourceModel<ObjectifAffecte>{
  idObjectifAffecte: any;
  modeleObjectif: ModeleObjectif;
  categoriePersonne: Categorie;
  indicateur: Indicateur;
  periodicite: Periodicite;
  valeurAffecte: number;
  valeurReelle: number;
  affectation: Affectation;

  constructor(model?: Partial<ObjectifAffecte>) {
    super(model);
  }
}
