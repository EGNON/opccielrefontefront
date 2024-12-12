import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";

export class Operationpaiementrachat2 extends  ResourceModel<Operationpaiementrachat2>{
  idOpcvm:number;
  idSeance:number;
  idActionnaire:number;
  nomSigle:string;
  prenomRaisonSociale:string;
  montant:number;
  idOperation:number;
  idTransaction:number;
  codeNatureOperation:string;
  dateOperation:Date;
  libelleOperation:string;
  dateSaisie:Date;
  datePiece:Date;
  dateValeur:Date;
  referencePiece:string;
  valeurFormule:string;
  valeurCodeAnalytique:string;
  userLogin:string;
  dateDernModifClient:string;

  constructor(model?: Partial<Operationpaiementrachat2>) {
    super(model);
  }
}
