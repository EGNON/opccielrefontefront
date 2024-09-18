import {TitreModel} from "./titre.model";

export class OpcModel extends TitreModel{
  vlOrigine: number;
  periodiciteVlNbre: number;
  periodiciteVlUnite: string;
  classificationOPC: any;
  typeAffectationTitre: any;
  formeJuridiqueOpc: any;

  constructor (model?: Partial<OpcModel>) {
    super(model);
  }
}
