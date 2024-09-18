
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class OpcvmService {
  API_URL = `${environment.apiUrl}/opcciel1/opcvm`;
  constructor(private  http: HttpClient) {

  }

  afficherOpcvm()
  {
    return this.http.get<any[]>(`${this.API_URL}`);
  }
}
