import {BaseModel} from "./base.model";
import {ResourceModel} from "./core/resource.model";

export class Typemodele extends ResourceModel<Typemodele>{
  idTypeModele: number;
  libelleTypeModele: string;
  constructor(model?: Partial<Typemodele>) {
    super(model);
  }
}
