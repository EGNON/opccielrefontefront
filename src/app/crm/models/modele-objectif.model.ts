import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";
import {DetailObjectif} from "./detail-objectif.model";

export class ModeleObjectif extends ResourceModel<ModeleObjectif>{
  idModelObj: number;
  nomModele: string;
  detailObjectifs: DetailObjectif[];

  constructor(model?: Partial<ModeleObjectif>) {
    super(model);
  }
}
