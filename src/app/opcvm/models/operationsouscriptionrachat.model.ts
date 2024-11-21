import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";

export class Operationsouscriptionrachat extends  ResourceModel<Operationsouscriptionrachat>{
  idOperation:number;
  transaction:Transaction;
  idSeance:number;
  actionnaire:Personne;
  opcvm:Opcvm;
  natureOperation:Natureoperation;
  dateOperation:Date;
  libelleOperation:string  ;
  dateSaisie:Date;
  datePiece:Date;
  dateValeur:Date;
  referencePiece:string;
  montantSousALiquider:number;
  estExtournee:boolean;
  estOpExtournee:boolean;
  idOpExtournee:number;
  sousRachatPart:number;
  commisiionSousRachat:number;
  tAFCommissionSousRachat:number;
  retrocessionSousRachat:number;
  tAFRetrocessionSousRachat:number;
  commissionSousRachatRetrocedee:number;
  modeValeurLiquidative:string;
  coursVL:number;
  nombrePartSousRachat:number;
  regulResultatExoEnCours:number;
  regulSommeNonDistribuable:number;
  regulReportANouveau:number;
  regulautreResultatBeneficiaire:number;
  regulautreResultatDeficitaire:number;
  regulResultatEnInstanceBeneficiaire:number;
  regulResultatEnInstanceDeficitaire:number;
  regulExoDistribution:number;
  fraisSouscriptionRachat:number;
  reste:number;
  idTransaction:number;
  idActionnaire:number;
  quantiteSouhaite:number;
  montantDepose:number;
  montantConvertiEnPart:number;
  estRetrocede:boolean;
  resteRembourse:boolean;
  rachatPaye:boolean;
  ecriture:string;
  valeurFormule:string;
  valeurCodeAnalytique:string;
  constructor(model?: Partial<Operationsouscriptionrachat>) {
    super(model);
  }
}
