import {ResourceModel} from "../../crm/models/core/resource.model";


export class Natureevenement extends  ResourceModel<Natureevenement>{
  idNatureEvenement: number;
  libelleNatureEvenement: string;

  constructor(model?: Partial<Natureevenement>) {
  super(model);
}
}
