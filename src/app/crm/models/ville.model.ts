import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Ville extends ResourceModel<Ville>{
  idVille: number;
  libelleVille: string;

  constructor(model?: Partial<Ville>) {
    super(model);
  }
}
