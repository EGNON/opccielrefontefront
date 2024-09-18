import {BaseModel} from "./base.model";
import {ResourceModel} from "./core/resource.model";


export class Systemedinformation extends  ResourceModel<Systemedinformation>{
  idSystemeDinformation:number;
  logiciel:string;
  dateAcquisition:Date;
  dateInfoCREPMF:Date;
  denomination:string;
  dateDebutMaintenance:Date;
  dateFinMaintenance:Date;
  principalFonctionnalite:string;

  constructor(model?: Partial<Systemedinformation>) {
  super(model);
}
}
