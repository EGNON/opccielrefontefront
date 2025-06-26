import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";
import {TitreModel} from "../../titresciel/models/titre.model";

export class Operationextournevde extends  ResourceModel<Operationextournevde>{
  idSeance:number;
  titre:TitreModel;
  opcvm:Opcvm;
  qteDetenue:number;
  cours:number;
  cumpT:number;
  cumpReel:number;
  plusOuMoinsValue:number;
  nbreJourCourus:number;
  interetCourus:number;
  valeurVDECours:number;
  valeurVDEInteret:number;
  idOpCours:number;
  idOpInteret:number;
  irvm:number
  estVerifie:boolean;
  dateVerification:Date;
  userLoginVerificateur:string;
  estVerifie1:boolean;
  dateVerification1:Date;
  userLoginVerificateur1:string;
  estVerifie2:boolean;
  dateVerification2:Date;
  dateValeur:Date;
  userLoginVerificateur2:string;
  userLogin:string;

  constructor(model?: Partial<Operationextournevde>) {
    super(model);
  }
}
