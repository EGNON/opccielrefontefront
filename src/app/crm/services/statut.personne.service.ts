import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {StatutPersonne} from "../models/statut.personne.model";
import {Observable} from "rxjs";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class StatutPersonneService extends ResourceService<StatutPersonne> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,StatutPersonne,`${environment.apiUrl}/statutPersonnes`);
    this.API_URL = `${environment.apiUrl}/statutPersonnes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ajouterStatutSelonQualite(statutPersonne: StatutPersonne,
                            qualite: string): Observable<any>
  {
    return this.http.post<any>(`${this.API_URL}/qualite?q=${qualite}`, statutPersonne);
  }
  modifierStatutPersonne(statutPersonne: StatutPersonne, idPersonne: number,idQualite:number): Observable<any>
  {
    return this.http.put<any>(`${this.API_URL}/${idPersonne}/${idQualite}`, statutPersonne);
  }
}
