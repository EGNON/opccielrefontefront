import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";

export class Operationdetachement extends  ResourceModel<Operationdetachement>{
  idDetachement:number;
  transaction:Transaction;
  idSeance:number;
  intervenant:Personne;
  opcvm:Opcvm;
  natureOperation:Natureoperation;
  dateOperation:Date;
  libelleOperation:string  ;
  dateSaisie:Date;
  datePiece:Date;
  dateValeur:Date;
  referencePiece:string;
  symboleTitre:string;
  designationTitre:string;
  idTransaction:number;
  idActionnaire:number;
  ecriture:string;
  valeurFormule:string;
  valeurCodeAnalytique:string;
  codeNatureOperation:string;
  type:string;
  typeEvenement:string;
  typePayement:string;
  idIntervenant:number;
  qteDetenue:number;
  couponDividendeUnitaire:number;
  montantBrut:number;
  quantiteAmortie:number;
  nominalRemb:number;
  capitalRembourse:number;
  montantTotalARecevoir:number;
  idOpcvm:number;
  estPaye:boolean;
  dateReelle:Date;
  userLogin:string;

  constructor(model?: Partial<Operationdetachement>) {
    super(model);
  }
}
