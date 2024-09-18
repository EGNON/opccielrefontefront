import {ResourceModel} from "../../crm/models/core/resource.model";

export class ModeAmortissementModel extends ResourceModel<ModeAmortissementModel>{
  idModeAmortissement: number;
  libelleModeAmortissement: string;
  constructor (model?: Partial<ModeAmortissementModel>) {
    super(model);
  }
}
