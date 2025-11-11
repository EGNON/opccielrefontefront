import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../../core/models/opcvm";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Exercice} from "../../lab/models/exercice.model";

@Injectable({
  providedIn: 'root'
})
export class ExerciceService extends ResourceService<any> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Opcvm,`${environment.apiUrl}/exercices`);
    this.API_URL = `${environment.apiUrl}/exercices`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
 afficherListeExercice(datatableRequest: any, idOpcvm: number) {
    return this.http.post<any>(`${this.API_URL}/datatable/list/${idOpcvm}`, datatableRequest);
  }
  afficherExerciceCourant(idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/courant/${idOpcvm}`);
  }
  afficherExercice(idOpcvm:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}`);
  }
  afficherExerciceById(idOpcvm:any,code:any){
    return this.http.get<any>(`${this.API_URL}/${idOpcvm}/${code}`);
  }
   modifier(data: any,idOpcvm:any,code:any) {
    return this.http.put<any>(`${this.API_URL}/${idOpcvm}/${code}`, data)
  }
}
