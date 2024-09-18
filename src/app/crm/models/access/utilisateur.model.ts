import {Role} from "./role.model";
import {Personnel} from "../personne/personnel.model";
import {Token} from "../../../core/modules/auth/models/token.model";
import {UtilisateurRole} from "./utilisateur-role.model";
import {UtilisateurRolePermission} from "../../../core/modules/auth/models/utilisateur-role-permission.model";

export class Utilisateur extends Personnel{
  username!: string;
  password!: string;
  utilisateurRoles!: UtilisateurRole[];
  permissions: UtilisateurRolePermission[];
  roles: Role[];
  roles1: UtilisateurRole[];
  tokens: Token[];

  constructor(model?: Partial<Utilisateur>) {
    super(model);
  }

  setUser(_user: unknown) {
    const user = _user as Utilisateur;
    this.id = user.id;
    this.idPersonne = user.idPersonne;
    this.username = user.username || '';
    this.password = user.password || '';
    this.emailPro = user.emailPro || '';
    this.emailPerso = user.emailPerso || '';
    this.domicile = user.domicile || '';
    // this.pic = user.pic || './assets/media/avatars/blank.png';
    this.utilisateurRoles = user.utilisateurRoles || [];
    this.roles = user.roles || [];
    this.roles1 = user.roles1 || [];
    this.permissions = user.permissions || [];
  }
}
