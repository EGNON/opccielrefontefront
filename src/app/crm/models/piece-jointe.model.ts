import {BaseModel} from "./base.model";
import {Typedocument} from "./typedocument.model";
import {Compterendu} from "./compterendu.model";
import {Personne} from "./personne/personne.model";
import {RDV} from "./rdv.model";
import { ResourceModel } from "./core/resource.model";

export class PieceJointe extends ResourceModel<PieceJointe>{
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

  constructor(model?: Partial<PieceJointe>) {
    super(model);
  }
}
