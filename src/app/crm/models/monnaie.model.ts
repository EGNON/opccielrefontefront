import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Monnaie extends ResourceModel<Monnaie>{
  codeMonnaie: string;
  nom: string;

  constructor(model?: Partial<Monnaie>) {
    super(model);
  }
}
