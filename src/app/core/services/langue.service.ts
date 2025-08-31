import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Langue} from "../models/langue.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LangueService extends ResourceService<Langue>{
  constructor(private http: HttpClient) {
    super(http, Langue, '');
    this.API_URL = `${environment.apiUrl}/langues`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
