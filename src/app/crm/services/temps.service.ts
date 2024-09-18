import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {NbrJour} from "../models/nbr-jour.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Temps} from "../models/temps.model";

@Injectable({
  providedIn: 'root'
})
export class TempsService extends TableService<Temps> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/temps`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherTempsTous()
  {
    return this.http.get<Temps[]>(`${this.API_URL}/tous`);
  }
}
