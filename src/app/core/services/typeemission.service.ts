import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeemission} from "../models/typeemission.model";

@Injectable({ providedIn: 'root' })
export class TypeemissionService extends ResourceService<Typeemission> {
  constructor(private http: HttpClient) {
    super(http, Typeemission, `${environment.apiUrl}/typeemissions`);
    this.API_URL = `${environment.apiUrl}/typeemissions`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
