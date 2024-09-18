import {ResourceModel} from "../../crm/models/core/resource.model";


export class Classetitre extends  ResourceModel<Classetitre>{
  codeClasseTitre: string;
  libelleClasseTitre: string;

  constructor(model?: Partial<Classetitre>) {
    super(model);
  }
}
