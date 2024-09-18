import {ResourceModel} from "../../crm/models/core/resource.model";

export class Place extends  ResourceModel<Place>{
  codePlace: string;
  libellePlace: string;

  constructor(model?: Partial<Place>) {
  super(model);
}
}
