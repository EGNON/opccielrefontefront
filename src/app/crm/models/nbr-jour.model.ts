import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class NbrJour extends ResourceModel<NbrJour>{
  idNbreJours: number;

  constructor(model?: Partial<NbrJour>) {
    super(model);
  }
}
