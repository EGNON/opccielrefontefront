import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Commune extends ResourceModel<Commune>{
  idCommune: number;
  libelleCommune: string;

  constructor(model?: Partial<Commune>) {
    super(model);
  }
}
