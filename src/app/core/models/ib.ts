import {ResourceModel} from "../../crm/models/core/resource.model";
import {Typeib} from "./typeib";

export class Ib extends ResourceModel<Ib>{
  codeIB: string;
  libelleIb: string;
  estIbSysteme:boolean;
  typeIb:Typeib;
  constructor(model?: Partial<Ib>) {
    super(model);
  }
}
