import {BaseModel} from "./base.model";
import {Time} from "@angular/common";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";

export interface Mail extends BaseModel{
  idMail: number;
  objet: string;
  msg: string;
  dateEnvoi: Date;
  heureEnvoi: Time;
  modeleMsgAlerte:ModeleMsgAlerte;
}
