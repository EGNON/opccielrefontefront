import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import {TitreModel} from "../../titresciel/models/titre.model";
import {Typeordre} from "./typeordre.model";

export class Ordre extends  ResourceModel<Ordre>{
  idOrdre:number;
  opcvm:Opcvm;
  idTitre:number;
  idIntervenant:number;
  titre:TitreModel;
  role:string;
  dateOrdre:Date;
  statut:string;
  typeOrdre:Typeordre;
  quantiteLimite:number;
  personne:Personne;
  dateEnvoi:Date;
  dateLimite:Date;
  coursLimite:number;
  accepterPerte:boolean;
  estEnvoye:boolean;
  commissionPlace:number;
  commissionSGI:number;
  commissionDepositaire:number;
  tAF:number;
  iRVM:number;
  interet:number;
  plusOuMoinsValue:number;
  quantiteExecute:number;
  montantNet:number;
  montantBrut:number;
  commentaires:string;
  idOperation:number;
  idSeance:number;
  natureOperation:Natureoperation
  libelleOperation:string
  valeurFormule:string
  valeurCodeAnalytique:string
  userLogin:string;

  constructor(model?: Partial<Ordre>) {
    super(model);
  }
}
