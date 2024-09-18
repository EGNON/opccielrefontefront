import {PersonneMorale} from "../../crm/models/personne/personne.morale.model";

export class Emetteur extends PersonneMorale{
  constructor(model?: Partial<Emetteur>) {
    super(model);
  }
}
