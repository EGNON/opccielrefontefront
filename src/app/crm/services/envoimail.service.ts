import {Inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import {EnvoiMail} from "../models/envoimail.model";

@Injectable({
  providedIn: 'root'
})
export class EnvoimailService extends TableService<EnvoiMail> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/envoimails`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherEnvoiMailSelonMail(idMail:number):Observable<EnvoiMail[]>
  {
    return this.http.get<EnvoiMail[]>(environment.apiUrl + '/envoimails/'+idMail);
  }

  supprimerEnvoiMailSelonMail(idMail:number):Observable<EnvoiMail>
  {
    return this.http.delete<EnvoiMail>(environment.apiUrl + '/envoimails/'+idMail);
  }
}
