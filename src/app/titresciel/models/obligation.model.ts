import {TitreModel} from "./titre.model";

export class ObligationModel  extends TitreModel{
  datePremierPaiement: Date;
  dateDernierPaiement: Date;
  dateJouissance: Date;
  dureeNbre: number;
  dureeUnite: string;
  periodiciteNbre: number;
  periodiciteUnite: string;
  usance: number;
  differeNbre: number;
  differeUnite: string;
  modeAmortissement: any;
  typeAmortissement: any;
  tauxBrut: number;
  tauxNet: number;
  nombreTitres: number;
  typeObligation: any;
  estParAdjudication: boolean;
  numeroIdentification: string;
  denominationEmission: string;

  constructor (model?: Partial<ObligationModel>) {
    super(model);
  }
}
