import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrdreService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/ordres`);
    this.API_URL = `${environment.apiUrl}/ordres`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  creer(resource: any) {
    return this.http.post<any>(`${this.API_URL}`, resource);
  }
  calculer(resource: any) {
    return this.http.post<any>(`${this.API_URL}/calculer`, resource);
  }

  modifier(resource: any) {
    return this.http.put<any>(`${this.API_URL}`, resource);
  }
  validation(id: any,userLogin:any) {
    return this.http.put<any>(`${this.API_URL}/validation/${id}/${userLogin}`, null);
  }
   impressionOrdre(idOpcvm: any,idSeance:any) {
    return this.http.get<any>(`${this.API_URL}/impression/${idOpcvm}/${idSeance}`);
  }
  apercuOrdreDeBourse(numeroOrdre: any) {
    return this.http.get<any>(`${this.API_URL}/jasperpdf/ordreDeBourse/${numeroOrdre}`);
  }
  supprimer(idOrdre: any,userLogin:any) {
    return this.http.delete<any>(`${this.API_URL}/${idOrdre}/${userLogin}`);
  }

  afficherListeOrdre(datatableRequest: any, idOpcvm: number) {
    return this.http.post<any>(`${this.API_URL}/datatable/list/${idOpcvm}`, datatableRequest);
  }
  afficherListe(idOpcvm: number) {
    return this.http.get<any>(`${this.API_URL}/tous/${idOpcvm}`);
  }
 afficherSelonId(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

}
