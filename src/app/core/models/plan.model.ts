import {ResourceModel} from "../../crm/models/core/resource.model";

export class Plan extends  ResourceModel<Plan>{
  codePlan: string;
  libellePlan: string;
  numCompteCapital: string;
  numCompteBenefice: string;
  numComptePerte: string;
  numCompteResInsDistribution: string;

  constructor(model?: Partial<Plan>) {
  super(model);
}
}
