import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Personne} from "../../crm/models/personne/personne.model";


export class Detailprofil extends  ResourceModel<Detailprofil>{
  opcvm: Opcvm;
  codeProfil: string;
  borneInferieur:number;
  borneSuperieur:number;
  montantMinimum:number;
  taux:number;

  constructor(model?: Partial<Detailprofil>) {
  super(model);
}
}
