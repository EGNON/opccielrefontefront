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
  etatSuiviAtionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatsuiviactionnaire`, param);
  }
  etatSuiviAtionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/etatsuiviactionnaire`, param);
  }
  etatSuiviAtionnaireListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatsuiviactionnaire/liste`, param);
  }
  etatSuiviClientEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/etatsuiviclient`, param);
  }
  etatSuiviClientListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/etatsuiviclient/liste`, param);
  }
  pointTresorerie(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/pointtresorerie`, param);
  }
  historiqueActionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/historiqueactionnaire`, param);
  }
  historiqueActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/historiqueactionnaire`, param);
  }
  releveActionnaireEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/releveactionnaire`, param);
  }
  ficheClientEtat(param: any) {
    return this.http.post<any>(`${this.API_URL}/etats/ficheclient`,param);
  }
  releveActionnaire(param: any) {
    return this.http.post<any>(`${this.API_URL}/releveactionnaire`, param);
  }
  afficherPersonnePhysiqueMorale() {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemorale`);
  }
  rechercherPersonnePhysiqueMorale(valeur:any) {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemorale/${valeur}`);
  }
  rechercherPersonnePhysiqueMoraleSelonType(type:any,valeur:any) {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemoraleselontype/${type}/${valeur}`);
  }
  afficherPersonnePhysiqueMoraleSelonType(valeur:any) {
    return this.http.get<any>(`${this.API_URL}/personnephysiquemoraleselontype/${valeur}`);
  }
  historiqueActionnaireListe(param: any) {
    return this.http.post<any>(`${this.API_URL}/historiqueactionnaire/liste`, param);
  }
  procedureComptable() {
    return this.http.get<any>(`${this.API_URL}/etats/procedurecomptable`);
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
