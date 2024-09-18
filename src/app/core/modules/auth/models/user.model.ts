import { AuthModel } from './auth.model';
import {Utilisateur} from "../../../../crm/models/access/utilisateur.model";
import {Role} from "../../../../crm/models/access/role.model";
import {UtilisateurRole} from "../../../../crm/models/access/utilisateur-role.model";

export class UserModel extends AuthModel {
  id: number | undefined;
  idPersonne: number;
  username: string;
  password: string;
  emailPro: string;
  emailPerso: string;
  pic: string;
  roles: Role[] = [];
  domicile: string;
  // personal information
  denomination: string;
  prenom: string;
  nom: string;
  utilisateurRoles: UtilisateurRole[]

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
    // this.roles = user.roles || [];
  }
}
