import {BaseModel} from "./base.model";
import {Personne} from "./personne/personne.model";
import {Mail} from "./mail.model";
import { ResourceModel } from "./core/resource.model";

export class EnvoiMail extends ResourceModel<EnvoiMail>{
  personneDto: Personne;
  mailDto: Mail;
  
  constructor(model?: Partial<EnvoiMail>) {
    super(model);
  }
}
