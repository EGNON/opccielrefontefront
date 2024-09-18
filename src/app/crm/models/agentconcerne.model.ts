import {BaseModel} from "./base.model";
import {RDV} from "./rdv.model";
import {Time} from "@angular/common";
import {Personnel} from "./personne/personnel.model";

export interface AgentConcerne extends BaseModel{
  rdvDto:RDV;
  personnelDto:Personnel;
  dateDebReelle:Date;
  heureDebReelle:Time;
  dateFinReelle:Date;
  heureFinReelle:Time;
  etat:boolean;
}
