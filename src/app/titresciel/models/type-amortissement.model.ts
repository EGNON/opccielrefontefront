import {ResourceModel} from "../../crm/models/core/resource.model";

export class TypeAmortissementModel extends ResourceModel<TypeAmortissementModel>{
  idTypeAmortissement: number;
  codeTypeAmortissement: string;
  libelleTypeAmortissement: string;
  constructor (model?: Partial<TypeAmortissementModel>) {
    super(model);
  }
}
