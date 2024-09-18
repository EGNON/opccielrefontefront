import {ResourceModel} from "../../crm/models/core/resource.model";
import {Typeib} from "./typeib";
import {Ib} from "./ib";
import {Typerubrique} from "./typerubrique";

export class Ibrubriqueposition extends ResourceModel<Ibrubriqueposition>{
  codeRubrique: string;
  codePosition: string;
  libellePosition: string;
  typeValeur: string;
  valeur: number;
  totalBlocage: number;
  estModele: boolean;
  ib:Ib;
  constructor(model?: Partial<Ibrubriqueposition>) {
    super(model);
  }
}
