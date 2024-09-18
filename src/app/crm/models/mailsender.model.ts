import {BaseModel} from "./base.model";

export interface MailSender extends BaseModel{
  recipientEmailMany:string[];
  recipientEmailOne:string;
  subject:string;
  content:string;
  fileName:string[];
  url:string[];
}
