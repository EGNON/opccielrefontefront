import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class TypeDocument extends ResourceModel<TypeDocument>{
  idTypeDoc: number;
  libelleTypeDoc: string;

  constructor(model?: Partial<TypeDocument>) {
    super(model);
  }
}
