import {ResourceModel} from "../core/resource.model";
import {UtilisateurRole} from "./utilisateur-role.model";
import {Permission} from "../../../core/models/permission";
import {UtilisateurRolePermission} from "../../../core/modules/auth/models/utilisateur-role-permission.model";
import {RolePermission} from "../../../core/modules/auth/models/role-permission";

export class Role extends ResourceModel<Role>{
  idRole!: number;
  nom!: string;
  description: string;
  permissions: RolePermission[];
  utilisateurs1: UtilisateurRole[];

  constructor(model?: Partial<Role>) {
    super(model);
  }
}
