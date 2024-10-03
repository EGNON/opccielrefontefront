import {ResourceModel} from "../../../crm/models/core/resource.model";

export class Categorieclient extends  ResourceModel<Categorieclient>{
  idCategorieClient: number;
  intitule: string;
  code: string;

  constructor(model?: Partial<Categorieclient>) {
    super(model);
  }
}
