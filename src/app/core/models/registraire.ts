import {PersonneMorale} from "../../crm/models/personne/personne.morale.model";
import {ResourceModel} from "../../crm/models/core/resource.model";

export class Registraire extends PersonneMorale{
  constructor(model?: Partial<Registraire>) {
    super(model);
  }
}
