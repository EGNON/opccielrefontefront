import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Quartier extends ResourceModel<Quartier>{
  idQuartier: number;
  libelleQuartier: string;

  constructor(model?: Partial<Quartier>) {
    super(model);
  }
}
