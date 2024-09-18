import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Personne} from "../../crm/models/personne/personne.model";


export class Actionnairecommission extends  ResourceModel<Actionnairecommission>{
  opcvm: Opcvm;
  personne: Personne;
  codeProfil:string;
  libelleProfil:string;
  typeCommission:string;
  date:Date;
  constructor(model?: Partial<Actionnairecommission>) {
  super(model);
}
}
