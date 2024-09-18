import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeevenement} from "../models/typeevenement.model";

@Injectable({ providedIn: 'root' })
export class TypeevenementService extends ResourceService<Typeevenement> {
  constructor(private http: HttpClient) {
    super(http, Typeevenement, `${environment.apiUrl}/typeevenements`);
    this.API_URL = `${environment.apiUrl}/typeevenements`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
