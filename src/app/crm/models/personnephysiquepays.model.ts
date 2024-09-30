import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";
import {Pays} from "./pays.model";
import {PersonnePhysique} from "./personne/personne.physique.model";

export class Personnephysiquepays extends ResourceModel<Personnephysiquepays>{
  paysDto:Pays;
  personnePhysiqueDto:PersonnePhysique;

  constructor(model?: Partial<Personnephysiquepays>) {
    super(model);
  }
}
