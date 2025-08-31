import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Payslangue} from "../models/payslangue.model";

@Injectable({
  providedIn: 'root'
})
export class PayslangueService extends ResourceService<Payslangue>{
  constructor(private http: HttpClient) {
    super(http, Payslangue, '');
    this.API_URL = `${environment.apiUrl}/payslangues`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonLangue(id:number){
    return this.http.get<any>(`${this.API_URL}/${id}`)
  }
  supprimerSelonLangue(id:number){
    return this.http.delete<any>(`${this.API_URL}/${id}`)
  }
  afficherSelonPays(id:number){
    return this.http.get<any>(`${this.API_URL}/pays/${id}`)
  }
}
