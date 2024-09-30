import {BaseModel} from "./base.model";
import {Alerte} from "./alerte.model";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";
import {DiffusionAlerte} from "./diffusionalerte.model";
import {Personnel} from "./personne/personnel.model";
import {Personne} from "./personne/personne.model";
import { ResourceModel } from "./core/resource.model";

export class ProtoAlerte extends ResourceModel<ProtoAlerte>{
  alerte: Alerte;
  modeleMsgAlerte: ModeleMsgAlerte;
  contenu: string;
  diffusionAlertes: DiffusionAlerte[];
  personnels: Personne[];

  constructor(model?: Partial<ProtoAlerte>) {
    super(model);
  }
}
