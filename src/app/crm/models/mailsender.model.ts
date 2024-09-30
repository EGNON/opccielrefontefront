import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class MailSender extends ResourceModel<MailSender>{
  recipientEmailMany:string[];
  recipientEmailOne:string;
  subject:string;
  content:string;
  fileName:string[];
  url:string[];

  constructor(model?: Partial<MailSender>) {
    super(model);
  }
}
