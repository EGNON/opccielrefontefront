import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Natureoperation} from "../models/natureoperation.model";

@Injectable({ providedIn: 'root' })
export class NatureoperationService extends ResourceService<Natureoperation> {
  constructor(private http: HttpClient) {
    super(http, Natureoperation, `${environment.apiUrl}/natureoperations`);
    this.API_URL = `${environment.apiUrl}/natureoperations`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonTypeOperation(code:string){
    return this.http.get<any>(`${this.API_URL}/typeoperation/${code}`)
  }
}
