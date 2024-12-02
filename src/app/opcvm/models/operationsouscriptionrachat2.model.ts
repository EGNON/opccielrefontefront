import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";

export class Operationsouscriptionrachat2 extends  ResourceModel<Operationsouscriptionrachat2>{
  idOperation:number;
  idTransaction:number;
  idSeance:number;
  idActionnaire:number;
  idOpcvm:number;
  idPersonne:number;
  codeNatureOperation:string;
  dateOperation:Date;
  libelleOperation:string;
  dateSaisie:Date;
  datePiece:Date;
  dateValeur:Date;
  referencePiece:string;
  montantSousALiquider:number;
  sousRachatPart:number;
  commisiionSousRachat: number;
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
  reste:number
  quantiteSouhaite:number;
  montantDepose:number;
  montantConvertiEnPart:number;
  estRetrocede:Boolean;
  resteRembourse:Boolean;
  rachatPaye:Boolean;
  ecriture:string;
  valeurFormule:string;
  valeurCodeAnalytique:string;
  userLogin:string;
  constructor(model?: Partial<Operationsouscriptionrachat2>) {
    super(model);
  }
}
