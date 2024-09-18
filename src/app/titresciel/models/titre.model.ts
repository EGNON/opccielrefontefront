import {ResourceModel} from "../../crm/models/core/resource.model";
import {PersonneMorale} from "../../crm/models/personne/personne.morale.model";
import {Pays} from "../../crm/models/pays.model";
import {Secteur} from "../../crm/models/secteur.model";
import {Place} from "../../core/models/place.model";
import {Typetitre} from "../../core/models/typetitre.model";
import {Typeemission} from "../../core/models/typeemission.model";

export class TitreModel extends ResourceModel<TitreModel>{
  idTitre: number;
  libelleTitre: string;
  typeVM: string;
  idOcc: number = 0;
  symbolTitre: string;
  designationTitre: string;
  place: Place;
  depositaire: PersonneMorale;
  typeEmission: Typeemission;
  typeTitre: Typetitre;
  secteur: Secteur;
  compartiment: any;
  normalAssimile: any;
  pays: Pays;
  registraire: PersonneMorale;
  emetteur: PersonneMorale;
  lotMinimum: number = 0;
  nominal: number = 0;
  codeIsin: string;
  dateOuverture: Date;
  dateEmission: Date;
  dateCloture: Date;
  estActif: boolean = false;
  appliqueFiscaliteLocale: boolean = false;
  tauxFiscaliteLocale: number = 0;
  tauxFiscalitePays: number = 0;
  estReglementaire: boolean = false;
  borneInferieurFluctuation: number = 0;
  borneSuperieurFluctuation: number = 0;
  irvm;
  libelleCotation;
  cours;
  tabAmortissements;
  opcvms;
  constructor (model?: Partial<TitreModel>) {
    super(model);
  }
}
