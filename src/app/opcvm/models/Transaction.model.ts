import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {TypeAmortissementModel} from "../../titresciel/models/type-amortissement.model";
import {Natureoperation} from "../../core/models/natureoperation.model";

export class Transaction extends  ResourceModel<Transaction>{
 idTransaction:number;
  opcvm:Opcvm;
  idSeance:number;
  dateTransaction:Date;
  natureOperation:Natureoperation;
  estVerifie:boolean;

  constructor(model?: Partial<Transaction>) {
    super(model);
  }
}
