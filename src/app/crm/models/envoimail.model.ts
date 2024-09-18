import {BaseModel} from "./base.model";
import {Personne} from "./personne/personne.model";
import {Mail} from "./mail.model";

export interface EnvoiMail extends BaseModel{
  personneDto: Personne;
  mailDto: Mail;
}
