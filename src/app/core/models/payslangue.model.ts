import {ResourceModel} from "../../crm/models/core/resource.model";
import {Pays} from "../../crm/models/pays.model";
import {Langue} from "./langue.model";

export class Payslangue extends  ResourceModel<Payslangue>{
  pays: Pays;
  langue: Langue;

  constructor(model?: Partial<Payslangue>) {
    super(model);
  }
}
