import {BaseModel} from "./base.model";
import {Compterendu} from "./compterendu.model";
import {DiffusionAlerte} from "./diffusionalerte.model";
import {Periodicite} from "./periodicite.model";
import {TypePlanification} from "./type-planification.model";
import {JourAlerte} from "./jour-alerte.model";
import {TempsAlerte} from "./temps-alerte.model";
import {NbreJoursAlerte} from "./nbr-jour-alerte.model";
import {ProtoAlerte} from "./proto-alerte.model";
import {Time} from "@angular/common";

export interface Alerte extends BaseModel{
  idAlerte: number;
  dateDebut: Date;
  dateFin: Date;
  heureDebut: Time;
  heureFin: Time;
  frequence: number;
  destinataire: string;
  compteRendu: Compterendu;
  diffusionAlertes: DiffusionAlerte[];
  periodicite: Periodicite;
  typePlanification: TypePlanification;
  joursAlertes: JourAlerte[];
  tempsAlertes: TempsAlerte[];
  nbreJoursAlertes: NbreJoursAlerte[];
  protoAlertes: ProtoAlerte[];
  typeAlerte: string;
}
