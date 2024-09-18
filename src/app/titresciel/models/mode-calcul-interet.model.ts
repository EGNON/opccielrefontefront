import {ResourceModel} from "../../crm/models/core/resource.model";

export class ModeCalculInteretModel extends ResourceModel<ModeCalculInteretModel>{
  idModeCalculInteret: number;
  codeModeCalculInteret: string;
  libelleModeCalculInteret: string;

  constructor (model?: Partial<ModeCalculInteretModel>) {
    super(model);
  }
}
