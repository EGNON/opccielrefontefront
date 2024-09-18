import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProtoAlerte} from "../models/proto-alerte.model";

@Injectable({
  providedIn: 'root'
})
export class ProtoAlerteService extends TableService<ProtoAlerte> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/protoAlertes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
