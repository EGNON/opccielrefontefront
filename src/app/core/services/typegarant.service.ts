import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typegarant} from "../models/typegarant.model";

@Injectable({ providedIn: 'root' })
export class TypegarantService extends ResourceService<Typegarant> {
  constructor(private http: HttpClient) {
    super(http, Typegarant, `${environment.apiUrl}/typegarants`);
    this.API_URL = `${environment.apiUrl}/typegarants`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
