import {TitreModel} from "./titre.model";

export class TcnModel extends TitreModel{
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
  nombreTitre: number;
  estParAdjudication: boolean;
  numeroIdentification: string;
  denominationEmission: string;
  natureTcn: any;
  formulePrecomptee: string;

  constructor (model?: Partial<TcnModel>) {
    super(model);
  }
}
