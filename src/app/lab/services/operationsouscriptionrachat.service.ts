import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {EntityService} from "../../crm/services/entity.service";
import {DepotRachat} from "../models/depotrachat.model";
import {DataTablesResponse} from "../../crm/models/table.model";
import {Operationsouscriptionrachat} from "../models/operationsouscriptionrachat.model";


@Injectable({
  providedIn: 'root'
})
export class OperationsouscriptionrachatService extends EntityService<Operationsouscriptionrachat> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/operationsouscriptionrachat`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherListeDepotRecenseSurAnnee(codeExercice:number)
  {
    return this.http.get<Operationsouscriptionrachat[]>(`${this.API_URL}/depotsurannee/${codeExercice}`);
  }

  afficherOperationNouvelleRelationSupADixMillions(annee:number)
  {
    return this.http.get<Operationsouscriptionrachat[]>(`${this.API_URL}/nouvellerelation/${annee}`);
  }

}
