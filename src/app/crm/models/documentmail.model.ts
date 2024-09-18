import {BaseModel} from "./base.model";
import {Mail} from "./mail.model";
import {PieceJointe} from "./piece-jointe.model";

export interface DocumentMail extends BaseModel{
  documentDto: PieceJointe;
  mailDto:Mail;
}
