import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Jour} from "../models/jour.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class JourService extends ResourceService<Jour> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Jour,`${environment.apiUrl}/jours`);
    this.API_URL = `${environment.apiUrl}/jours`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getJoursAll()
  {
    return this.http.get<Jour[]>(`${this.API_URL}`);
  }
}
