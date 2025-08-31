import {Inject, Injectable, OnDestroy} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Quartier} from "../models/quartier.model";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class QuartierService extends ResourceService<Quartier> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Quartier,`${environment.apiUrl}/quartiers`);
    this.API_URL = `${environment.apiUrl}/quartiers`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherQuartierListe(libelle:string):Observable<Quartier>
  {
    return this.http.get<Quartier>(environment.apiUrl + '/quartiers/liste/'+libelle);
  }
}
