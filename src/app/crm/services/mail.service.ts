import {Inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Quartier} from "../models/quartier.model";
import {Observable} from "rxjs";
import {Mail} from "../models/mail.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class MailService extends ResourceService<Mail> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Mail,`${environment.apiUrl}/mails`);
    this.API_URL = `${environment.apiUrl}/mails`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  creer(entity:any)
  {
    return this.http.post<any>(`${this.API_URL}/creer`,entity);
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Mail>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}
