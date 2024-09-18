import {BaseModel} from "../base.model";
import {Secteur} from "../secteur.model";
import {Degre} from "../degre.model";
import {Profession} from "../profession.model";

export interface Personnephysiquemorale extends BaseModel{
  id: number;
  idPersonne: number;
  denomination:string;
  emailPerso: string;
  emailPro: string;

}
