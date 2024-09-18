import {BaseModel} from "./base.model";
import {Pays} from "./pays.model";
import {PersonnePhysique} from "./personne/personne.physique.model";

export interface Personnephysiquepays extends BaseModel{
  paysDto:Pays;
  personnePhysiqueDto:PersonnePhysique;
}
