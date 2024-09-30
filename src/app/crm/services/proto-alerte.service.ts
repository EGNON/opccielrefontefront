import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProtoAlerte} from "../models/proto-alerte.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class ProtoAlerteService extends ResourceService<ProtoAlerte> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,ProtoAlerte,`${environment.apiUrl}/protoAlertes`);
    this.API_URL = `${environment.apiUrl}/protoAlertes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
