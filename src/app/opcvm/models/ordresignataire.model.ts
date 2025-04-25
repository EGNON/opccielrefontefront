// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";
import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Plan} from "../../core/models/plan.model";
import {Ordre} from "./ordre.model";
import {Personne} from "../../crm/models/personne/personne.model";

export class Ordresignataire extends ResourceModel<Ordresignataire>{

  ordre:Ordre;
  personne:Personne;

  constructor(model?: Partial<Ordresignataire>) {
    super(model);
  }
}
