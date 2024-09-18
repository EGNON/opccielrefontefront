import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DiffusionAlerte} from "../models/diffusionalerte.model";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiffusionAlerteService extends TableService<DiffusionAlerte> implements OnDestroy{
  API_ADD_URL = "";
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/diffusionalertes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getAll()
  {
    return this.http.get<DiffusionAlerte[]>(`${this.API_URL}`);
  }

  saveDiffusionAlerte(diffusionAlerte:DiffusionAlerte):Observable<DiffusionAlerte>
  {
    return this.http.post<DiffusionAlerte>(environment.apiUrl + '/diffusionalertes',diffusionAlerte);

  }
  afficherDiffusionAlerte():Observable<DiffusionAlerte>
  {
    return this.http.get<DiffusionAlerte>(environment.apiUrl + '/diffusionalertes');

  }
  afficherDiffusionAlerteSelonAlerte(idAlerte:number):Observable<DiffusionAlerte[]>
  {
    return this.http.get<DiffusionAlerte[]>(environment.apiUrl + '/diffusionalertes/'+idAlerte);

  }
  supprimerDiffusionAlerteSelonAlerte(idAlerte:number):Observable<DiffusionAlerte>
  {
    return this.http.delete<DiffusionAlerte>(environment.apiUrl + '/diffusionalertes/'+idAlerte);

  }
}
