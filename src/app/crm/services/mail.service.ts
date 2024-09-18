import {Inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Quartier} from "../models/quartier.model";
import {Observable} from "rxjs";
import {Mail} from "../models/mail.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";

@Injectable({
  providedIn: 'root'
})
export class MailService extends EntityService<Mail> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/mails`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherQuartierListe(id:number):Observable<Quartier>
  {
    return this.http.get<Quartier>(environment.apiUrl + '/quartiers/liste/'+id);
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
