import {Personne} from "./personne.model";
import {Formejuridique} from "../formejuridique.model";

export class PersonneMorale extends Personne{
  sigle!: string;
  raisonSociale!: string;
  siteWeb!: string;
  numRegistre!:string;
  NumeroAgrementPersonneMorale!:string;
  capitalSocial!:number;
  formeJuridique:Formejuridique;
  dateCreationPM:Date;

  constructor(model?: Partial<PersonneMorale>) {
    super(model);
  }
}
