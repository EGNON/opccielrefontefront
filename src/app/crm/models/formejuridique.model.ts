import {BaseModel} from "./base.model";
import {ResourceModel} from "./core/resource.model";


export class Formejuridique extends  ResourceModel<Formejuridique>{
  codeFormeJuridique: string;
  libelleFormeJuridique: string;

  constructor(model?: Partial<Formejuridique>) {
  super(model);
}
}
