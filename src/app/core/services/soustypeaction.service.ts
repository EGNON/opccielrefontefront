import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Soustypeaction} from "../models/soustypeaction.model";

@Injectable({ providedIn: 'root' })
export class SoustypeactionService extends ResourceService<Soustypeaction> {
  constructor(private http: HttpClient) {
    super(http, Soustypeaction, `${environment.apiUrl}/soustypeactions`);
    this.API_URL = `${environment.apiUrl}/soustypeactions`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
