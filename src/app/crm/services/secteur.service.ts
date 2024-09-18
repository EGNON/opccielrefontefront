import {Inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Secteur} from "../models/secteur.model";
import {DataTablesResponse} from "../models/data-tables.response.model";
import {EntityService} from "./entity.service";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class SecteurService extends ResourceService<Secteur> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Secteur,`${environment.apiUrl}/secteurs`);
    this.API_URL = `${environment.apiUrl}/secteurs`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Secteur>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  afficherListe()
  {
    return this.http.get<Secteur>(`${this.API_URL}/liste`);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}
