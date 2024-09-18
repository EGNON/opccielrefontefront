import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typetitre} from "../models/typetitre.model";

@Injectable({ providedIn: 'root' })
export class TypetitreService extends ResourceService<Typetitre> {
  constructor(private http: HttpClient) {
    super(http, Typetitre, `${environment.apiUrl}/typetitres`);
    this.API_URL = `${environment.apiUrl}/typetitres`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
