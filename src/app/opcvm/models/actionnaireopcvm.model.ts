import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Personne} from "../../crm/models/personne/personne.model";

export class Actionnaireopcvm extends ResourceModel<Actionnaireopcvm>{
  opcvm: Opcvm;
  personne: Personne;

  constructor(model?: Partial<Actionnaireopcvm>) {
    super(model);
  }
}
