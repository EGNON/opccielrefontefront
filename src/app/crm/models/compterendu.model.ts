import {BaseModel} from "./base.model";
import {Time} from "@angular/common";
import {Produit} from "./produit.model";
import {RDV} from "./rdv.model";
import {PieceJointe} from "./piece-jointe.model";
import {Utilisateur} from "./access/utilisateur.model";
import {Opcvm} from "../../core/models/opcvm";
import { ResourceModel } from "./core/resource.model";

export class Compterendu extends ResourceModel<Compterendu>{
  idCR: number;
  dateCR: Date;
  heureDebCR: Time;
  heureFinCR: Time;
  objetCR: string;
  appreciation: string;
  description: string;
  dateProchainRDV: Date;
  montantPromesse: number;
  montantRealisation: number;
  promesse: string;
  realisation: string;
  dateEffectivePromesse: Date;
  produitASouscrire: Produit;
  produitSouscrit: Produit;
  opcvmASouscrire: Opcvm;
  opcvmSouscrit: Opcvm;
  rdv: RDV;
  documents: PieceJointe[];
  createur: Utilisateur;
  estValide: false | true;

  constructor(model?: Partial<Compterendu>) {
    super(model);
  }
}
