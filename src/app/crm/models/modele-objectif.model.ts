import {BaseModel} from "./base.model";
import {DetailObjectif} from "./detail-objectif.model";

export interface ModeleObjectif extends BaseModel{
  idModelObj: number;
  nomModele: string;
  detailObjectifs: DetailObjectif[];
}
