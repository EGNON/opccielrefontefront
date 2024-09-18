import {ResourceModel} from "../../crm/models/core/resource.model";

export class FormeJuridiqueOpc extends ResourceModel<FormeJuridiqueOpc>{
  idFormeJuridiqueOpc: number;
  codeFormeJuridiqueOpc: string;
  libelleFormeJuridiqueOpc: string;

  constructor(model?: Partial<FormeJuridiqueOpc>) {
    super(model);
  }
}
