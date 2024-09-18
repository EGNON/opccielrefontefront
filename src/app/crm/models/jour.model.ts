import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Jour extends ResourceModel<Jour>{
  idJours: number;
  libelleJours: string;

  constructor(model?: Partial<Jour>) {
    super(model);
  }
}
