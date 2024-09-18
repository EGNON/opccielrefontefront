import {ResourceModel} from "../../crm/models/core/resource.model";

export class Typetitre extends  ResourceModel<Typetitre>{
  codeTypeTitre: string;
  libelleTypeTitre: string;

  constructor(model?: Partial<Typetitre>) {
    super(model);
  }
}
