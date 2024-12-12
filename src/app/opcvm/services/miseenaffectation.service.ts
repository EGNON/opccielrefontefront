import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Exercice} from "../../lab/models/exercice.model";

@Injectable({
  providedIn: 'root'
})
export class MiseenaffectationService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,null,`${environment.apiUrl}/miseenaffectations`);
    this.API_URL = `${environment.apiUrl}/miseenaffectations`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  verificationMiseAffectationEnAttente(idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}`);
  }
}
