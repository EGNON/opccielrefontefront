import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Banque} from "../models/banque.model";

@Injectable({ providedIn: 'root' })
export class BanqueService extends ResourceService<Banque> {
  constructor(private http: HttpClient) {
    super(http, Banque, `${environment.apiUrl}/banques`);
    this.API_URL = `${environment.apiUrl}/banques`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
