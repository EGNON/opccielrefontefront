import {BaseModel} from "./base.model";
import {RDV} from "./rdv.model";
import {Time} from "@angular/common";
import {Personnel} from "./personne/personnel.model";
import { ResourceModel } from "./core/resource.model";

export class AgentConcerne extends ResourceModel<AgentConcerne>{
  rdvDto:RDV;
  personnelDto:Personnel;
  dateDebReelle:Date;
  heureDebReelle:Time;
  dateFinReelle:Date;
  heureFinReelle:Time;
  etat:boolean;

  constructor(model?: Partial<AgentConcerne>) {
    super(model);
  }
}
