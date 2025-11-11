import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "./table.sevice";
import {ObjectifAffecte} from "../models/objectif-affecte.model";
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Affectation} from "../models/affectation.model";
import { ResourceService } from './core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class ObjectifAffecteService extends ResourceService<ObjectifAffecte> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,ObjectifAffecte,`${environment.apiUrl}/objectifaffectes`);
    this.API_URL = `${environment.apiUrl}/objectifaffectes`;
  }

  ngOnDestroy(): void {
  }

  afficherSelonPersonnelEtPeriodicite(idPerosnnel:number,beginEndDate:any)
  {
    return this.http.post<Affectation[]>(`${this.API_URL}`+'/etats/'+idPerosnnel,beginEndDate);
  }
  afficherObjectifPrevu(idPersonnel:number,beginEndDate:any)
  {
    return this.http.post<any>(`${this.API_URL}`+
      '/objectifprevu/'+idPersonnel,beginEndDate,{responseType: 'blob' as any });
  }
  afficherObjectifReel(idPersonnel:number,beginEndDate:any)
  {
    return this.http.post<any>(`${this.API_URL}`
      +'/objectifreel/'+idPersonnel,beginEndDate,{responseType: 'blob' as any });
  }
}
