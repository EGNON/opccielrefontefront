import {ResourceModel} from "../../crm/models/core/resource.model";


export class Typeevenement extends  ResourceModel<Typeevenement>{
  idTypeEvenement: number;
  libelleTypeEvenement: string;

  constructor(model?: Partial<Typeevenement>) {
  super(model);
}
}
