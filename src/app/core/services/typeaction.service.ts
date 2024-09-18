import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeaction} from "../models/typeaction.model";

@Injectable({ providedIn: 'root' })
export class TypeactionService extends ResourceService<Typeaction> {
  constructor(private http: HttpClient) {
    super(http, Typeaction, `${environment.apiUrl}/typeactions`);
    this.API_URL = `${environment.apiUrl}/typeactions`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
