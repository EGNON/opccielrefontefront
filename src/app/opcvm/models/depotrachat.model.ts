import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";

export class Depotrachat extends  ResourceModel<Depotrachat>{
  idOperation:number;
  idDepotRachat:number;
  //private TransactionDto transaction;
  natureOperation:Natureoperation;
  dateOperation:Date;
  libelleOperation:string;
  dateSaisie:Date;
  datePiece:Date;
  dateValeur:Date;
  referencePiece:string;
  montant:number;
  quantite:number;
  ecriture:string;
  estOD:boolean;
  type:string;
  actionnaire:Personne;
  idSeance:number;
  personne:Personne;
  opcvm:Opcvm;
  modeVL:string;
  estVerifie1:boolean;
  dateVerification1:Date;
  userLoginVerificateur1:string;
  estVerifie2:boolean;
  dateVerification2:Date;
  userLoginVerificateur2:string;
  estGenere:boolean;
  estVerifier:boolean;
  nomVerificateur:string;
  dateVerification:Date;
  montantSouscrit:number;
  //titre:Titre;
  qte:number;
  cours:number;
  commission:number;
  interetCouru:number;
  interetPrecompte:number;

  constructor(model?: Partial<Depotrachat>) {
    super(model);
  }
}
