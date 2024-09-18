import {Inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Quartier} from "../models/quartier.model";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuartierService extends TableService<Quartier> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
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
