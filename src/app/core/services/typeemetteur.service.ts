import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typeemetteur} from "../models/typeemetteur.model";

@Injectable({ providedIn: 'root' })
export class TypeemetteurService extends ResourceService<Typeemetteur> {
  constructor(private http: HttpClient) {
    super(http, Typeemetteur, `${environment.apiUrl}/typeemetteurs`);
    this.API_URL = `${environment.apiUrl}/typeemetteurs`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
