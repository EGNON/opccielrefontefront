import {BaseModel} from "./base.model";
import { ResourceModel } from "./core/resource.model";

export class Categorie extends ResourceModel<Categorie>{
  idCategorie: number;
  libelle: string;

  constructor(model?: Partial<Categorie>) {
    super(model);
  }
}
