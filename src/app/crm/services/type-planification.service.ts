import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TypePlanification} from "../models/type-planification.model";

@Injectable({
  providedIn: 'root'
})
export class TypePlanificationService extends TableService<TypePlanification> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/typeplanifications`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
