import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class TypePlanification extends ResourceModel<TypePlanification>{
  idTypePlanification: number;
  libelleTypePlanification: string;

  constructor(model?: Partial<TypePlanification>) {
    super(model);
  }
}
