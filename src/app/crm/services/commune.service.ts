import {Inject, Injectable, OnDestroy} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Ville} from "../models/ville.model";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import {Quartier} from "../models/quartier.model";
import {Commune} from "../models/commune.model";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class CommuneService extends ResourceService<Commune> implements OnDestroy{

  constructor(private http: HttpClient) {
    super(http,Commune,`${environment.apiUrl}/communes`);
    this.API_URL = `${environment.apiUrl}/communes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherCommuneListe():Observable<Commune>
  {
    return this.http.get<Commune>(environment.apiUrl + '/communes/liste');
  }
}
