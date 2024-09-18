import {ResourceModel} from "../../crm/models/core/resource.model";

export class QualiteTitreModel extends ResourceModel<QualiteTitreModel>{
  idQualite: number;
  libelleQualite: string;
  classeTitre: any;

  constructor (model?: Partial<QualiteTitreModel>) {
    super(model);
  }
}
