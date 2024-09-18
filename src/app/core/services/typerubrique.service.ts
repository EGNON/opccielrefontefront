import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Typerubrique} from "../models/typerubrique";

@Injectable({ providedIn: 'root' })
export class TyperubriqueService extends ResourceService<Typerubrique> {
  constructor(private http: HttpClient) {
    super(http, Typerubrique, `${environment.apiUrl}/typerubriques`);
    this.API_URL = `${environment.apiUrl}/typerubriques`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
