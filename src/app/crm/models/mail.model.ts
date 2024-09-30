import {BaseModel} from "./base.model";
import {Time} from "@angular/common";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";
import { ResourceModel } from "./core/resource.model";

export class Mail extends ResourceModel<Mail>{
  idMail: number;
  objet: string;
  msg: string;
  dateEnvoi: Date;
  heureEnvoi: Time;
  modeleMsgAlerte:ModeleMsgAlerte;

  constructor(model?: Partial<Mail>) {
    super(model);
  }
}
