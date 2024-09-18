import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {TypeAmortissementModel} from "../../titresciel/models/type-amortissement.model";
import {Natureoperation} from "../../core/models/natureoperation.model";

export class Charge extends  ResourceModel<Charge>{
  idCharge:number;
  codeCharge:string;
  opcvm: Opcvm;
  designation:string;
  montant:number;
  periodicite:number;
  unitePeriodicite:string;
  estActif:boolean;
  nbreAmortissement:number;
  typeCharge:string;
  natureOperation:Natureoperation;
  typeCommission:string;
  typeAmortissement:TypeAmortissementModel;
  appliquerSurActifNet:boolean;
  codeFiscalite:string;
  reference:boolean;
  adeduire:boolean;
  numOrdre:number;

  constructor(model?: Partial<Charge>) {
    super(model);
  }
}
