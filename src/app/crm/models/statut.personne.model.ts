import {BaseModel} from "./base.model";
import {Personne} from "./personne/personne.model";
import {Qualite} from "./qualite.model";
import {Personnel} from "./personne/personnel.model";

export interface StatutPersonne extends BaseModel{
  idStatutPersonne: any;
  personne: Personne;
  qualite: Qualite | null | undefined;
  personnel: Personnel | null | undefined;
}
