import {Personne} from "./personne.model";
import {Profession} from "../profession.model";
import {Pays} from "../pays.model";
import {Secteur} from "../secteur.model";
import {Personnephysiquepays} from "../personnephysiquepays.model";
import {Langue} from "../../../core/models/langue.model";

export class PersonnePhysique extends Personne{
  nom!: string;
  prenom!: string;
  sexe!: string;
  dateNaissance!: Date;
  civilite!: string;
  lieuTravail!: string;
  autresRevenus!: number;
  periodicite!: string;
  statutMatrimonial!: string;
  nbrEnfant!: number;
  nbrPersonneACharge!: number;
  //Employeur
  nomEmployeur!: string;
  adressePostaleEmp!: string;
  adresseGeoEmp!: string;
  telEmp!: string;
  emailEmp!: string;
  secteurEmp!: Secteur;
  //Pere
  nomPere!: string;
  prenomsPere!: string;
  dateNaissancePere!: Date;
  paysPere!: Pays;
  //Mere
  nomMere!: string;
  prenomsMere!: string;
  dateNaissanceMere!: Date;
  paysMere!: Pays;
  //Conjoint
  nomConjoint!: string;
  prenomConjoint!: string;
  dateNaissanceConjoint!: Date;
  paysConjoint!: Pays;
  origineFonds!: string;
  transactionEnvisagee!: string;
  immobilier!: string;
  autresBiens!: string;
  surfaceTotale!: number;
  salaire!: number;
  profession!: Profession;
  paysNationalite!: Pays;
  personnePhysiquePaysDtos:Personnephysiquepays[];
  teint:string;
  langue:Langue;
  exposeMotif:string;

  constructor(model?: Partial<PersonnePhysique>) {
    super(model);
  }
}
