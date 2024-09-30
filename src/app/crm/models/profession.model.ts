import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Profession extends ResourceModel<Profession>{
  idProf: number;
  libelleProfession: string;

  constructor(model?: Partial<Profession>) {
    super(model);
  }
}
