import {ResourceModel} from "../../../../crm/models/core/resource.model";
import {Role} from "../../../../crm/models/access/role.model";
import {Permission} from "../../../models/permission";

export class RolePermission extends ResourceModel<RolePermission>{
  role: Role;
  permission: Permission;

  constructor(model?: Partial<RolePermission>) {
    super(model);
  }
}
