import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";
import {TitreModel} from "../../titresciel/models/titre.model";

export class Operationchargeaetaler extends  ResourceModel<Operationchargeaetaler>{
  estGenere:boolean;
  actifBrut:number;
  codeCharge:string;
  nbreJour:number
  usance:number
  codeModele:string
  userLogin:string
  designation:string
  idOpcvm :number
  opcvm :Opcvm
  idSeance :number
  typeCharge :string;
  montantCharge:number
  idOperation :number
  idTransaction:number
//     Long getIdSeance ();
 idActionnaire :number
//	Long getIdOpcvm();
  codeNatureOperation:string
  dateOperation:Date
  libelleOperation:string
  dateSaisie :Date
  datePiece:Date
  dateValeur:Date
  referencePiece:string
  montant:number
  estVerifie1 :boolean
  dateVerification1:Date
  userLoginVerificateur1:string
  estVerifie2 :boolean;
  dateVerification2:Date;
  userLoginVerificateur2:string;
  constructor(model?: Partial<Operationchargeaetaler>) {
    super(model);
  }
}
