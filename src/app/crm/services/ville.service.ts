import {Inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Ville} from "../models/ville.model";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class VilleService extends ResourceService<Ville> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Ville,`${environment.apiUrl}/villes`);
    this.API_URL = `${environment.apiUrl}/villes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherVilleListe():Observable<Ville>
  {
    return this.http.get<Ville>(environment.apiUrl + '/villes/liste');
  }
}
