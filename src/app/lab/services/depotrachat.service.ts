import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {EntityService} from "../../crm/services/entity.service";
import {DepotRachat} from "../models/depotrachat.model";
import {DataTablesResponse} from "../../crm/models/table.model";


@Injectable({
  providedIn: 'root'
})
export class DepotRachatService extends EntityService<DepotRachat> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/depotrachat`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<DepotRachat>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  afficherOperationSupereurACinqMillions()
  {
    return this.http.get<DepotRachat>(`${this.API_URL}/liste`);
  }
  afficherDepotRecenseSurAnnee(datatableRequest: any,codeExercice:number)
  {
    return this.http.post<DataTablesResponse<DepotRachat>>(`${this.API_URL}/datatable/list/depotsurannee/${codeExercice}`, datatableRequest);
  }
  afficherListeDepotRecenseSurAnnee(codeExercice:number,montant:number)
  {
    return this.http.get<DepotRachat[]>(`${this.API_URL}/depotsurannee/${codeExercice}/${montant}`);
  }
}
