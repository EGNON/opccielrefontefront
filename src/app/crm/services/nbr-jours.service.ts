import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NbrJour} from "../models/nbr-jour.model";

@Injectable({
  providedIn: 'root'
})
export class NbrJoursService extends TableService<NbrJour> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/nbrejourss`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getNbrJoursAll()
  {
    return this.http.get<NbrJour[]>(`${this.API_URL}`);
  }
}
