import {TitreModel} from "./titre.model";

export class DatModel extends TitreModel{
  datePremierPaiement: Date;
  dateDernierPaiement: Date;
  dateJouissance: Date;
  dureeNbre: number;
  dureeUnite: string;
  periodiciteNbre: number;
  periodiciteUnite: string;
  usance: number;
  tauxBrut: number;
  tauxNet: number;

  constructor (model?: Partial<DatModel>) {
    super(model);
  }
}
