import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeobligation} from "../models/typeobligation.model";

@Injectable({ providedIn: 'root' })
export class TypeobligationService extends ResourceService<Typeobligation> {
  constructor(private http: HttpClient) {
    super(http, Typeobligation, `${environment.apiUrl}/typeobligations`);
    this.API_URL = `${environment.apiUrl}/typeobligations`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
