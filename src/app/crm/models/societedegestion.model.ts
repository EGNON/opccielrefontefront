import {PersonneMorale} from "./personne/personne.morale.model";


export class SocieteDeGestion extends PersonneMorale{
  codeSkype!:string;
  dateAgrement:Date;
  codeAgence:string;
  typeTeneurCompte:number;
  numeroOrdreTeneur:string;

  constructor(model?: Partial<SocieteDeGestion>) {
    super(model);
  }
}
