import {ResourceModel} from "../../crm/models/core/resource.model";
import {Plan} from "./plan.model";
import {Comptecomptable} from "./comptecomptable.model";
import {Modeleecriture} from "./modeleecriture.model";
import {Formule} from "./formule";
import {Pays} from "../../crm/models/pays.model";
import {Langue} from "./langue.model";

export class Payslangue extends  ResourceModel<Payslangue>{
  pays: Pays;
  langue: Langue;

  constructor(model?: Partial<Payslangue>) {
  super(model);
}
}
