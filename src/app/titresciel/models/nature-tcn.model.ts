import {ResourceModel} from "../../crm/models/core/resource.model";

export class NatureTcnModel extends ResourceModel<NatureTcnModel>{
  idNatureTcn: number;
  codeNatureTcn: string;
  libelleNatureTcn: string;

  constructor (model?: Partial<NatureTcnModel>) {
    super(model);
  }
}
