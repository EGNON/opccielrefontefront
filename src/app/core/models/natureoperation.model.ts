import {ResourceModel} from "../../crm/models/core/resource.model";
import {Journal} from "./journal.model";
import {Typeoperation} from "./typeoperation.model";


export class Natureoperation extends  ResourceModel<Natureoperation>{
  codeNatureoperation: string;
  libelleNatureoperation: string;
  journal:Journal;
  typeOperation:Typeoperation;
  constructor(model?: Partial<Natureoperation>) {
  super(model);
}
}
