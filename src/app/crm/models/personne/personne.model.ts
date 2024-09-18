import {Secteur} from "../secteur.model";
import {Degre} from "../degre.model";
import {Pays} from "../pays.model";
import {Quartier} from "../quartier.model";
import {PieceJointe} from "../piece-jointe.model";
import {StatutPersonne} from "../statut.personne.model";
import {ResourceModel} from "../core/resource.model";
import {Modeetablissement} from "../modeetablissement.model";
import {Ville} from "../ville.model";

export class Personne extends ResourceModel<Personne>{
  idPersonne!: number;
  denomination!: string;
  ifu!: string;
  mobile1!: string;
  mobile2!: string;
  fixe1!: string;
  fixe2!: string;
  bp!: string;
  emailPerso: string;
  emailPro: string;
  domicile!: string;
  numeroPiece!: string;
  typePiece!: string;
  dateExpirationPiece!: Date;
  modeEtablissement!: string;
  modeEtablissementDto!: Modeetablissement;
  nomContact!: string;
  prenomContact!: string;
  telContact!: string;
  emailContact!: string;
  titreContact!: string;
  numeroCpteDeposit!: string;
  secteur!: Secteur;
  degre!: Degre;
  distributeur!: Personne;
  paysResidence!: Pays;
  quartier!: Quartier;
  documents!: PieceJointe[];
  statutPersonnes!: StatutPersonne[];
  estsgi!: boolean;
  ppe1!: boolean;
  ppe2!: boolean;
  ppe3!: boolean;
  ppe4!: boolean;
  estConvertie!: boolean;
  estExpose:boolean;
  estJuge:boolean;
  estGele:boolean;
  ville:Ville;
  typePersonne:string;
  constructor(model?: Partial<Personne>) {
    super(model);
  }
}
