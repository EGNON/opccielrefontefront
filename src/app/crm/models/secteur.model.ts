import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Secteur extends ResourceModel<Secteur>{
  idSecteur: number;
  libelleSecteur: string;

  constructor(model?: Partial<Secteur>) {
    super(model);
  }
}
