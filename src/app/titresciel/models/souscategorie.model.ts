
import {ResourceModel} from "../../crm/models/core/resource.model";
import {Categorie} from "../../crm/models/categorie.model";

export class Souscategorie extends ResourceModel<Souscategorie>{
  idSousCategorie:number;
  libelleSousCategorie:string;
  categoriePersonne:Categorie;
  constructor (model?: Partial<Souscategorie>) {
    super(model);
  }
}
