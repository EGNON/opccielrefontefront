import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Modeetablissement extends ResourceModel<Modeetablissement>{
  idModeEtablissement: number;
  libelle: string;

  constructor(model?: Partial<Modeetablissement>) {
    super(model);
  }
}
