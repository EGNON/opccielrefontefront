import {ResourceModel} from "../../crm/models/core/resource.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Opcvm } from "./opcvm";
import {Plan} from "./plan.model";

export class Nantissement extends ResourceModel<Nantissement>{
  idOperation:number;
  idOcc:number;
  dateOperation:Date;
  montant:number;
  quantite:number;
  idActionnaire:number;
  personneActionnaire:Personne;
  opcvm:Opcvm;
  idSeance:number;
  coursVL:number;
  montantFrais:number;
  dateFinPrevue:Date;
  estLevee:boolean;
  dateLevee:Date;
  estVerifie1:boolean;
  dateVerification1:Date;
  userLoginVerificateur1:string;
  estVerifie2:boolean;
  dateVerification2:Date;
  userLoginVerificateur2:string;
  observation:string;
  observationNantis:string;
  estVerifie1L:boolean;
  dateVerification1L:Date;
  userLoginVerificateur1L:string;
  estVerifie2L:boolean;
  dateVerification2L:Date;
  userLoginVerificateur2L:string;
  montantPret:number;
  durree:number;
  uniteDuree:string;
  banque:string;

  constructor(model?: Partial<Nantissement>) {
    super(model);
  }
}
