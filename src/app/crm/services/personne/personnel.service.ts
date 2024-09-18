import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "../table.sevice";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Personnel} from "../../models/personne/personnel.model";
import {environment} from "../../../../environments/environment";
import {ResponseModel} from "../../models/table.model";
import {tap} from "rxjs/operators";
import { ResourceService } from '../core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService extends ResourceService<Personnel> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Personnel,`${environment.apiUrl}/personnels`);
    this.API_URL = `${environment.apiUrl}/personnels`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherPersonnelListe():Observable<Personnel>
  {
    return this.http.get<Personnel>(environment.apiUrl + '/personnels');
  }
  afficherListe():Observable<Personnel>
  {
    return this.http.get<Personnel>(environment.apiUrl + '/personnels/liste');
  }
  afficherPersonnelSelonEstCommercial():Observable<Personnel>
  {
    return this.http.get<Personnel>(environment.apiUrl + '/personnels/estcommercial');
  }
  afficherPersonnelSelonId(id:number):Observable<Personnel>
  {
    return this.http.get<Personnel>(environment.apiUrl + '/personnels/'+id);
  }

  datatable_Personnel(resource: any): Observable<ResponseModel<Personnel>> {
    return this.http.post<ResponseModel<Personnel>>(`${this.API_URL}/datatable/list`, resource);
  }
}
