import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";

export class Profilcommissionsousrach extends  ResourceModel<Profilcommissionsousrach>{
  opcvm: Opcvm;
  codeProfil: string;
  libelleProfil:string;
  typeCommission:string;
  standard:boolean;

  constructor(model?: Partial<Profilcommissionsousrach>) {
    super(model);
  }
}
