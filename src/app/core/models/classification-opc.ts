import {ResourceModel} from "../../crm/models/core/resource.model";

export class ClassificationOPC  extends ResourceModel<ClassificationOPC>{
  codeClassification: string;
  libelleClassification: string;

  constructor(model?: Partial<ClassificationOPC>) {
    super(model);
  }
}
