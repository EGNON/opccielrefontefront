import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Modeleecriture} from "../models/modeleecriture.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ModeleecritureService extends ResourceService<Modeleecriture>{
  constructor(private http: HttpClient) {
    super(http, Modeleecriture, '');
    this.API_URL = `${environment.apiUrl}/modeleecritures`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
