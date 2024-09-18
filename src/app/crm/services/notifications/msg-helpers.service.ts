import { Injectable } from '@angular/core';
import {MessageBoxService} from "./message-box.service";
import {map} from "rxjs/operators";
import {AuthService} from "../../../core/modules/auth";

@Injectable({
  providedIn: 'root'
})
export class MsgHelpersService {

  constructor(
    private messageBoxService: MessageBoxService,
    private authService: AuthService) {}

  notificationsToUser()
  {
    return this.messageBoxService.afficherTous().pipe(
      map(n => n.filter((obj) => {
        return obj.destinataire.idPersonne === this.authService.currentUserValue?.id;
      }))
    );
  }
}
