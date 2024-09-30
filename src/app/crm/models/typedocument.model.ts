import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Typedocument extends ResourceModel<Typedocument>{
  idTypeDoc:number;
  libelleTypeDoc:string;

  constructor(model?: Partial<Typedocument>) {
    super(model);
  }
}
