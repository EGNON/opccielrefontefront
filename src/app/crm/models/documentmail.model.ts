import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";
import {Mail} from "./mail.model";
import {PieceJointe} from "./piece-jointe.model";

export class DocumentMail extends ResourceModel<DocumentMail>{
  documentDto: PieceJointe;
  mailDto:Mail;

  constructor(model?: Partial<DocumentMail>) {
    super(model);
  }
}
