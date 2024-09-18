import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Compartiment} from "../models/compartiment.model";
import {ResourceService} from "../../crm/services/core/resource.service";

@Injectable({ providedIn: 'root' })
export class CompartimentService extends ResourceService<Compartiment> {
  constructor(private http: HttpClient) {
    super(http, Compartiment, `${environment.apiUrl}/compartiments`);
    this.API_URL = `${environment.apiUrl}/compartiments`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/tous`)
  }
}
