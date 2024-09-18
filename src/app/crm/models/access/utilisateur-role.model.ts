import {BaseModel} from "../base.model";
import {Utilisateur} from "./utilisateur.model";
import {Role} from "./role.model";
import {ResourceModel} from "../core/resource.model";

export class UtilisateurRole extends ResourceModel<UtilisateurRole>{
  idUr!: number;
  utilisateur!: Utilisateur;
  role!: Role;

  constructor(model?: Partial<UtilisateurRole>) {
    super(model);
  }
}
