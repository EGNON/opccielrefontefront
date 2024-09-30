import {BaseModel} from "../base.model";
import {Secteur} from "../secteur.model";
import {Degre} from "../degre.model";
import {Profession} from "../profession.model";
import { ResourceModel } from "../core/resource.model";

export class Personnephysiquemorale  extends ResourceModel<Personnephysiquemorale>{
//  id: number;
  idPersonne: number;
  denomination:string;
  emailPerso: string;
  emailPro: string;
  constructor(model?: Partial<Personnephysiquemorale>) {
    super(model);
  }
}
