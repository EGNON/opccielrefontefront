import {TitreModel} from "./titre.model";

export class ActionModel extends TitreModel{
  per: number;
  typeAction: any;
  sousTypeAction: any;
  nominalNonVerse: number;

  constructor (model?: Partial<ActionModel>) {
    super(model);
  }
}
