import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {TypePlanification} from "../models/type-planification.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class TypePlanificationService extends ResourceService<TypePlanification> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,TypePlanification,`${environment.apiUrl}/typeplanifications`);
    this.API_URL = `${environment.apiUrl}/typeplanifications`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTous(){
    return this.http.get<TypePlanification[]>(`${environment.apiUrl}/typeplanifications/tous`)
  }
}
