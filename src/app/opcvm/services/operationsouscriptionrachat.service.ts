import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Tarificationordinaire} from "../models/tarificationordinaire.model";
import { Operationsouscriptionrachat } from '../models/operationsouscriptionrachat.model';

@Injectable({ providedIn: 'root' })
export class OperationsouscriptionrachatService extends ResourceService<Operationsouscriptionrachat> {
  constructor(private http: HttpClient) {
    super(http, Operationsouscriptionrachat, `${environment.apiUrl}/operationsouscriptionrachats`);
    this.API_URL = `${environment.apiUrl}/operationsouscriptionrachats`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }

  creer(operationSouscriptionRachat:any){
    return this.http.post<Operationsouscriptionrachat>(`${this.API_URL}/creer`,operationSouscriptionRachat)
  }
}
