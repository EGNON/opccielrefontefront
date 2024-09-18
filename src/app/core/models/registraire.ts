import {PersonneMorale} from "../../crm/models/personne/personne.morale.model";

export class Registraire extends PersonneMorale{
  constructor(model?: Partial<Registraire>) {
    super(model);
  }
}
