import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LibrairiesService {
  private API_URL = `${environment.apiUrl}/libraries`;
  constructor(private http: HttpClient) { }

  registreActionnaires(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/registre/actionnaire/opcvm/xxxxxxx`, param);
  }

  registreActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/registre/actionnaire/opcvm`, param);
  }
  portefeuilleetat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/portefeuille`, param);
  }
  portefeuille(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/portefeuille`, param);
  }
  portefeuilleListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/portefeuille/liste`, param);
  }
  releveTitreFCP(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevetitrefcp`, param);
  }
  releveTitreFCPEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/etats/relevetitrefcp`, param);
  }
  releveTitreFCPListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/relevetitrefcp/liste`, param);
  }

  telechargerRegistreActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/jasperpdf/export/registre/actionnaire/xxxxxxx/yyyy`, param);
  }

  cumpActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/cump/actionnaire/opcvm`, param);
  }

  soldeToutCompte(param: any) {
    return this.http.post<any>(`${this.API_URL}/opcvm/solde/tout/compte`, param);
  }
}
