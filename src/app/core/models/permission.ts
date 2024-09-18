import {ResourceModel} from "../../crm/models/core/resource.model";

export class Permission extends ResourceModel<Permission> {
  idPermis: number;
  codePermis: string;
  estPrincipale: boolean = false;
  estParDefaut: boolean = false;
  libellePermis: string;
  description: string;
  etat: boolean = false;

  constructor(model?: Partial<Permission>) {
    super(model);
  }
}
