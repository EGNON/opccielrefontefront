import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import { HttpClient } from "@angular/common/http";
import {Opcvm} from "../../core/models/opcvm";
import {environment} from "../../../environments/environment";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OperationChargeEtalerService extends ResourceService<any> implements OnDestroy{

  constructor(
    private http: HttpClient,) {
    super(http,Opcvm,`${environment.apiUrl}/operationchargeaetalers`);
    this.API_URL = `${environment.apiUrl}/operationchargeaetalers`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

 precalcul(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/precalculchargeaetaler`, parameters);
  }
 afficherTous(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/datatable-list`, parameters);
  }
 creer(parameters: any) {
    return this.http.post<any>(`${this.API_URL}/creer`, parameters);
  }
  verifier(idSeance: any,idOpcvm:any) {
    return this.http.get<any>(`${this.API_URL}/jasperpdf/verifier/${idSeance}/${idOpcvm}`);
  }
  verifierChargeNiveau(idSeance: any,idOpcvm:any,estVerifie1:any,estVerifie2:any,niveau:any,niv:any) {
    return this.http.get<any>(`${this.API_URL}/jasperpdf/charge/${idSeance}/${idOpcvm}/${estVerifie1}/${estVerifie2}/${niveau}/${niv}`);
  }
  validerNiveau(obj: any) {
    return this.http.post<any>(`${this.API_URL}/validerniveau`,obj);
  }

}
