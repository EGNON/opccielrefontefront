import {Injectable, OnDestroy} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";

@Injectable({
  providedIn: 'root'
})
export class OpcvmService extends ResourceService<Opcvm> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/opcvms`);
    this.API_URL = `${environment.apiUrl}/opcvms`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  listeOpcvm(datatableRequest: any) {
    return this.http.post<any>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
}
