
import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {EntityService} from "../../crm/services/entity.service";
import {DepotRachat} from "../models/depotrachat.model";
import {DataTablesResponse} from "../../crm/models/table.model";
import {Exercice} from "../models/exercice.model";


@Injectable({
  providedIn: 'root'
})
export class ExerciceService extends EntityService<Exercice> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/exercices`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous()
  {
    return this.http.get<Exercice[]>(`${this.API_URL}`);
  }
}
