import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Actionnaireopcvm} from "../models/actionnaireopcvm.model";

@Injectable({ providedIn: 'root' })
export class ActionnaireopcvmService extends ResourceService<Actionnaireopcvm> {
  constructor(private http: HttpClient) {
    super(http, Actionnaireopcvm, `${environment.apiUrl}/actionnaireopcvms`);
    this.API_URL = `${environment.apiUrl}/actionnaireopcvms`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
  supprimer(idPersonne:any,idOpcvm:any){
    return this.http.delete<any>(`${this.API_URL}/${idPersonne}/${idOpcvm}`)
  }
}
