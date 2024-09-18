import {BaseModel} from "./base.model";
import {Alerte} from "./alerte.model";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";
import {DiffusionAlerte} from "./diffusionalerte.model";
import {Personnel} from "./personne/personnel.model";
import {Personne} from "./personne/personne.model";

export interface ProtoAlerte extends BaseModel{
  alerte: Alerte;
  modeleMsgAlerte: ModeleMsgAlerte;
  contenu: string;
  diffusionAlertes: DiffusionAlerte[];
  personnels: Personne[];
}
