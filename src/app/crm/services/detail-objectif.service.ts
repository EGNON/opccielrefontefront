import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {DetailObjectif} from "../models/detail-objectif.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class DetailObjectifService extends ResourceService<DetailObjectif> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,DetailObjectif,`${environment.apiUrl}/detailobjectifs`);
    this.API_URL = `${environment.apiUrl}/detailobjectifs`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
