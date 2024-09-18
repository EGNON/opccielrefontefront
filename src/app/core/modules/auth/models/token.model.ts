import {ResourceModel} from "../../../../crm/models/core/resource.model";
import {Utilisateur} from "../../../../crm/models/access/utilisateur.model";

export class Token extends ResourceModel<Token>{
  token: string;
  tokenType: 'BEARER';
  revoked: boolean;
  expired: boolean;
  user: Utilisateur;

  constructor(model?: Partial<Token>) {
    super(model);
  }
}
