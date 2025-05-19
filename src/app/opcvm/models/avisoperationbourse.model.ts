import {ResourceModel} from "../../crm/models/core/resource.model";
import {Ordre} from "./ordre.model";
import {Natureoperation} from "../../core/models/natureoperation.model";

export class Avisoperationbourse extends ResourceModel<Avisoperationbourse> {
  idAvis:number;
  idTransaction:number;
  idSeance:number;
  natureOperation:Natureoperation;
  dateOperation:Date;
  dateSaisie:Date;
  dateValeur:Date;
  datePiece:Date;
  referencePiece:string;
  montant:number;
  ecriture:string;
  libelleOperation:string;
  estOD:boolean;
  type:string;
  referenceAvis:string;
  ordre:Ordre;
  dateReceptionLivraisonPrevu:Date;
  quantiteLimite:number;
  coursLimite:number;
  commissionPlace:number;
  commissionDepositaire:number;
  commissionSGI:number;
  tAF:number;
  iRVM:number;
  interet:number;
  plusOuMoinsValue:number;
  montantBrut:number;
  idOperationRL:number;
  dateDernModifClient:Date;
  userLogin:string;
  valeurFormule:string;
  valeurCodeAnalytique:string;

  constructor(model?: Partial<Avisoperationbourse>) {
    super(model);
  }
}
