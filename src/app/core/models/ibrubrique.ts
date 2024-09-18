import {ResourceModel} from "../../crm/models/core/resource.model";
import {Typeib} from "./typeib";
import {Ib} from "./ib";
import {Typerubrique} from "./typerubrique";

export class Ibrubrique extends ResourceModel<Ibrubrique>{
  codeRubrique: string;
  libelleRubrique: string;
  ib:Ib;
  typeRubrique:Typerubrique;
  constructor(model?: Partial<Ibrubrique>) {
    super(model);
  }
}
