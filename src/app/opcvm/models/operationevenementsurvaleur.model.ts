import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";
import {Operationdetachement} from "./operationdetachement.model";

export class Operationevenementsurvaleur extends  ResourceModel<Operationevenementsurvaleur>{
  idAVis:number;
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
  operationDetachement:Operationdetachement;
  commission:number;
  irvm:number;
  interetMoratoireSurCapital:number;
  interetMoratoireSurInteret:number;
  commissionSurInteretMoratoire:number;
  referenceAvis:string;

  constructor(model?: Partial<Operationevenementsurvaleur>) {
    super(model);
  }
}
