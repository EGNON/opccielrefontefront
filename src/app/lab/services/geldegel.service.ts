import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Pays} from "../../crm/models/pays.model";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DataTablesResponse} from "../../crm/models/data-tables.response.model";
import {EntityService} from "../../crm/services/entity.service";
import {GelDegel} from "../../crm/models/geldegel.model";
import {Personne} from "../../crm/models/personne/personne.model";

@Injectable({
  providedIn: 'root'
})
export class GelDegelService extends EntityService<GelDegel> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/geldegels`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<GelDegel>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
  getGelDegelByEstGeleAndPersonne(id: any)
  {
    return this.http.get(`${this.API_URL}/estGele/${id}`);
  }
  afficherCompteGeleNonGele():Observable<Personne[]>
  {
    return this.http.get<Personne[]>(`${this.API_URL}/gele`);
  }
  afficherEtatCompte(estGele:boolean):Observable<Personne[]>
  {
    return this.http.get<Personne[]>(`${this.API_URL}/gele/${estGele}`);
  }
  updateGelDegel(gelDegel:GelDegel,id: any)
  {
    return this.http.put(`${this.API_URL}/estgele/${id}`,gelDegel);
  }
}
