import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Charge} from "../models/charge.model";

@Injectable({ providedIn: 'root' })
export class Infoscirculaire8Service extends ResourceService<any> {
  constructor(private http: HttpClient) {
    super(http, Charge, `${environment.apiUrl}/infoscirculaire8s`);
    this.API_URL = `${environment.apiUrl}/infoscirculaire8s`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  modifier(entity:any){
    return this.http.put<any>(`${this.API_URL}`,entity)
  }
  supprimer(id:any,userLogin:any){
    return this.http.delete<any>(`${this.API_URL}/${id}/${userLogin}`)
  }
}
