import {ResourceModel} from "./core/resource.model";
import {Personne} from "./personne/personne.model";

export class GelDegel extends ResourceModel<GelDegel> {
  idGelDegel!: number;
  dateDebut!: Date;
  dateFin!: Date;
  estGele:boolean;
  personneDto:Personne;
  constructor(model?: Partial<GelDegel>) {
    super(model);
  }
}
