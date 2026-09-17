import {ResourceModel} from "../../crm/models/core/resource.model";
export class SanctionOnu extends ResourceModel<SanctionOnu>{
  //id:number;
  nom:string;
  constructor(model?: Partial<SanctionOnu>) {
    super(model);
  }
}
