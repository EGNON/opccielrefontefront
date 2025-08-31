import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {NbrJour} from "../models/nbr-jour.model";
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Temps} from "../models/temps.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class TempsService extends ResourceService<Temps> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Temps,`${environment.apiUrl}/temps`);
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
