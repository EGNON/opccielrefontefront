import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Natureevenement} from "../models/natureevenement.model";

@Injectable({ providedIn: 'root' })
export class NatureevenementService extends ResourceService<Natureevenement> {
  constructor(private http: HttpClient) {
    super(http, Natureevenement, `${environment.apiUrl}/natureevenements`);
    this.API_URL = `${environment.apiUrl}/natureevenements`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
