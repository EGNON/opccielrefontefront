// import {BaseModel} from "./base.model";


import {BaseModel} from "../../crm/models/base.model";

export interface DepotRachat extends BaseModel{
  IdOperation:number;
  IdTransaction:string;
  codeNatureOperation:string;
  dateOperation:Date;
  libelleOperation:string;
  dateSaisie:Date;
  datePiece:Date;
  dateValeur:Date;
  referencePiece:string;
  montant:number;
  total:number;
  quantite:number;
  ecriture:string;
  estOD:boolean;
  typeOperation:string;
  IdActionnaire:number;
  IdSeance:number;
  IdPersonne:number;
  IdOpcvm:number;
  modeVL:string;
  denomination:string;
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
  numLigne:number;
  dateCreationServeur:Date;
  dateDernModifServeur:Date;
  dateDernModifClient:Date;
  userLogin:string;
  supprimer:boolean;
  montantSouscrit:number;
  idTitre:number;
  qte:number;
  cours:number;
  commission:number;
  interetCouru:number;
  interetPrecompte:number;
  denominationOpcvm:string;
  nomPersonnePhysique:string;
  prenomPersonnePhysique:string;
  libelleNatureOperation:string;
}
