import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Natureevenement} from "../models/natureevenement.model";
import { Nantissement } from '../models/nantissement.model';

@Injectable({ providedIn: 'root' })
export class NantissementService extends ResourceService<Nantissement> {
  constructor(private http: HttpClient) {
    super(http, Nantissement, `${environment.apiUrl}/nantissements`);
    this.API_URL = `${environment.apiUrl}/nantissements`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
  afficherPartNanti(idOpcvm:any,idActionnaire:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${idActionnaire}`)
  }
}
