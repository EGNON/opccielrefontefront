import {BaseModel} from "./base.model";
import {Typedocument} from "./typedocument.model";
import {Compterendu} from "./compterendu.model";
import {Personne} from "./personne/personne.model";
import {RDV} from "./rdv.model";

export interface PieceJointe extends BaseModel{
  idDoc: number;
  dateValidite: Date;
  dateRattachement: Date;
  chemin: string;
  nomDoc: string;
  extensionDoc: string;
  typeDocument: Typedocument;
  compteRendu: Compterendu;
  personne: Personne;
  rdv:RDV;
  fToByte:any;
  file: any;
}
