import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Secteurboursier} from "../models/secteurboursier.model";

@Injectable({ providedIn: 'root' })
export class SecteurboursierService extends ResourceService<Secteurboursier> {
  constructor(private http: HttpClient) {
    super(http, Secteurboursier, `${environment.apiUrl}/secteurboursiers`);
    this.API_URL = `${environment.apiUrl}/secteurboursiers`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
