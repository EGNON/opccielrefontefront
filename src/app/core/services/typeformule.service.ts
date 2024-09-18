import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeformule} from "../models/typeformule.model";

@Injectable({ providedIn: 'root' })
export class TypeformuleService extends ResourceService<Typeformule> {
  constructor(private http: HttpClient) {
    super(http, Typeformule, `${environment.apiUrl}/typeformules`);
    this.API_URL = `${environment.apiUrl}/typeformules`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
