import {Time} from "@angular/common";
import {Pays} from "./pays.model";
import {Quartier} from "./quartier.model";
import {Personnephysiquemorale} from "./personne/personnephysiquemorale.model";
import {BaseModel} from "./base.model";
import {PieceJointe} from "./piece-jointe.model";
import {Commune} from "./commune.model";
import {Personne} from "./personne/personne.model";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";
import {AgentConcerne} from "./agentconcerne.model";

export interface RDV extends BaseModel{
  idRdv: number;
  idPersonne: number;
  dateDebRdv: Date;
  dateFinRdv: Date;
  heureFinRdv: Time;
  heureDebutRdv: Time;
  objetRdv: string;
  denomination: string;
  libelleVille: string;
  paysDto: Pays;
  personnePhysiqueMoraleDto: Personnephysiquemorale;
  personne: Personne;
  quartierDto: Quartier;
  communeDto: Commune;
  documents: PieceJointe[];
  dateDebReelle:Date;
  heureDebReelle:Time;
  dateFinReelle:Date;
  heureFinReelle:Time;
  modeleMsgAlerteDto:ModeleMsgAlerte;
  agentConcerneDtos:AgentConcerne[];
}
