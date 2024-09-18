import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeib} from "../models/typeib";

@Injectable({ providedIn: 'root' })
export class TypeibService extends ResourceService<Typeib> {
  constructor(private http: HttpClient) {
    super(http, Typeib, `${environment.apiUrl}/typeibs`);
    this.API_URL = `${environment.apiUrl}/typeibs`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
