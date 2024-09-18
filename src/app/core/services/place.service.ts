import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Place} from "../models/place.model";

@Injectable({ providedIn: 'root' })
export class PlaceService extends ResourceService<Place> {
  constructor(private http: HttpClient) {
    super(http, Place, `${environment.apiUrl}/places`);
    this.API_URL = `${environment.apiUrl}/places`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
}
