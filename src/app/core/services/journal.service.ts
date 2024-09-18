import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Journal} from "../models/journal.model";

@Injectable({ providedIn: 'root' })
export class JournalService extends ResourceService<Journal> {
  constructor(private http: HttpClient) {
    super(http, Journal, `${environment.apiUrl}/journals`);
    this.API_URL = `${environment.apiUrl}/journals`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
