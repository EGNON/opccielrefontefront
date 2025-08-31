import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostecomptableseanceopcvmService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/postecomptableseanceopcvms`);
    this.API_URL = `${environment.apiUrl}/postecomptableseanceopcvms`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListe(params: any) {
    return this.http.post<any>(`${this.API_URL}/liste`,params);
  }
  creer(params: any) {
    return this.http.post<any>(`${this.API_URL}`,params);
  }
  verifierPosteComptableNiveau(idOpcvm: any,idSeance:any,estVerifie1:any,estVerifie2:any,niveau:any,niv:any) {
    return this.http.get<any>(`${this.API_URL}/jasperpdf/codepostecomptable/${idOpcvm}/${idSeance}/${estVerifie1}/${estVerifie2}/${niveau}/${niv}`);
  }
  validerNiveau(obj: any) {
    return this.http.post<any>(`${this.API_URL}/validerniveau`,obj);
  }
}
