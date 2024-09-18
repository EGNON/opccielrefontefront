import {ResourceModel} from "../../crm/models/core/resource.model";

export class TypeAffectationTitre extends ResourceModel<TypeAffectationTitre>{
  idTypeAffectation: number;
  libelleTypeAffectation: string;
  constructor(model?: Partial<TypeAffectationTitre>) {
    super(model);
  }
}
