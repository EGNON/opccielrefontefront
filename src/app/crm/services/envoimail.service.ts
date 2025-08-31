import {Inject, Injectable, OnDestroy} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import {EnvoiMail} from "../models/envoimail.model";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class EnvoimailService extends ResourceService<EnvoiMail> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,EnvoiMail,`${environment.apiUrl}/envoimails`);
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
