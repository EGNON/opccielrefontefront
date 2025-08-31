import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TypeordreService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/typeordres`);
    this.API_URL = `${environment.apiUrl}/typeordres`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  creer(resource: any) {
    return this.http.post<any>(`${this.API_URL}`, resource);
  }

  modifier(resource: any) {
    return this.http.put<any>(`${this.API_URL}/${resource.id}`, resource);
  }

  afficherListe() {
    return this.http.get<any>(`${this.API_URL}`);
  }
 afficherSelonId(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

}
