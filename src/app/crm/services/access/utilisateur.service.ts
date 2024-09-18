import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Utilisateur} from "../../models/access/utilisateur.model";
import {EntityService} from "../entity.service";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService extends EntityService<Utilisateur> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/utilisateurs`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
