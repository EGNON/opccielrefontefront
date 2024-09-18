import {BaseModel} from "./base.model";
import {Personnel} from "./personne/personnel.model";
import {ObjectifAffecte} from "./objectif-affecte.model";
import { ResourceModel } from "./core/resource.model";

export class Affectation extends ResourceModel<Affectation>{
  idAffectation: number;
  dateAffectation: Date;
  dateSoumission: Date;
  personnel: Personnel;
  objectifAffectes: ObjectifAffecte[];

  constructor(model?: Partial<Affectation>) {
    super(model);
  }
}
