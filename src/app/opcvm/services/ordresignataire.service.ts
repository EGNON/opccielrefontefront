import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrdresignataireService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/ordresignataires`);
    this.API_URL = `${environment.apiUrl}/ordresignataires`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  creer(resource: any) {
    return this.http.post<any>(`${this.API_URL}`, resource);
  }
  Enregistrer(idOrdre: any,idPersonne:any) {
    return this.http.post<any>(`${this.API_URL}/${idOrdre}/${idPersonne}`, null);
  }
  supprimer(id: any) {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }

  afficherListeOrdreSignataire(idOrdre: number) {
    return this.http.get<any>(`${this.API_URL}/${idOrdre}`);
  }

}
