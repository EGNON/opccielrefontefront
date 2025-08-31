import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DepotsouscriptionService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/depotrachats`);
    this.API_URL = `${environment.apiUrl}/depotrachats`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  creer(resource: any, type: string) {
    return this.http.post<any>(`${this.API_URL}/${type}`, resource);
  }

  modifier(resource: any, type: string) {
    return this.http.put<any>(`${this.API_URL}/modifier/${type}/${resource.id}`, resource);
  }

  afficherListeDepot(datatableRequest: any, idOpcvm: number, idSeance: number) {
    return this.http.post<any>(`${this.API_URL}/datatable/list/${idOpcvm}/${idSeance}`, datatableRequest);
  }

  solde(idActionnaire: number, idOpcvm: number) {
    return this.http.post<any>(`${environment.apiUrl}/libraries/${idActionnaire}/${idOpcvm}`, null);
  }

  verificationListeDepot(data: any) {
    return this.http.post<any>(`${this.API_URL}/verification/liste/depots`, data);
  }

  telechargerListeDepot(downloadRequest: any) {
    return this.http.post<any>(`${this.API_URL}/download/liste/verification/depot`, downloadRequest);
  }

  confirmerListeVerifDepot(listeDepots: any) {
    return this.http.post<any>(`${this.API_URL}/confirmer/liste/verification/depots/tous`, listeDepots);
  }

  confirmerListeVerifNiv2Depot(listeDepots: any) {
    return this.http.post<any>(`${this.API_URL}/confirmer/liste/verification/niveau1/depots/tous`, listeDepots);
  }

  precalculSouscription(parameter: any) {
    return this.http.post<any>(`${this.API_URL}/precalcul/souscription`, parameter);
  }
  precalculSouscriptionListe(parameter: any) {
    return this.http.post<any>(`${this.API_URL}/precalculliste/souscription`, parameter);
  }

  genererSouscription(parameter: any) {
    return this.http.post<any>(`${this.API_URL}/generer/souscription/tous`, parameter);
  }
}
