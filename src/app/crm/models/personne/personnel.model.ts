import {PersonnePhysique} from "./personne.physique.model";

export class Personnel extends PersonnePhysique{
  matricule!: string;
  estCommercial: boolean;

  constructor(model?: Partial<Personnel>) {
    super(model);
  }
}
