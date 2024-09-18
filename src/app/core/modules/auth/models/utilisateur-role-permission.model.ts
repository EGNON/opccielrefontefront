import {ResourceModel} from "../../../../crm/models/core/resource.model";
import {Utilisateur} from "../../../../crm/models/access/utilisateur.model";
import {Role} from "../../../../crm/models/access/role.model";
import {Permission} from "../../../models/permission";

export class UtilisateurRolePermission  extends ResourceModel<UtilisateurRolePermission>{
  idUtilisateurRolePermission: {
    idUtilisateur: any,
    idRole: any,
    idPermis: any
  };
  utilisateur: Utilisateur;
  role: Role;
  permission: Permission;

  constructor(model?: Partial<UtilisateurRolePermission>) {
    super(model);
  }
}
