import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Classetitre} from "../models/classetitre.model";

@Injectable({ providedIn: 'root' })
export class ClassetitreService extends ResourceService<Classetitre> {
  constructor(private http: HttpClient) {
    super(http, Classetitre, `${environment.apiUrl}/classetitres`);
    this.API_URL = `${environment.apiUrl}/classetitres`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
