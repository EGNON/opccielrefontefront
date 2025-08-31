import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {TitreModel} from "../models/titre.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DataTablesResponse} from "../../crm/models/table.model";
import {ObligationService} from "./obligation.service";
import {ActionService} from "./action.service";
import {DroitService} from "./droit.service";
import {TcnService} from "./tcn.service";
import {DatService} from "./dat.service";
import {OpcService} from "./opc.service";

@Injectable({
  providedIn: 'root'
})
export class TitreService extends ResourceService<TitreModel>{
  constructor(
    private http: HttpClient,
    private actionService: ActionService,
    private obligationService: ObligationService,
    private droitService: DroitService,
    private tcnService: TcnService,
    private datService: DatService,
    private opcService: OpcService
  ) {
    super(http, TitreModel, `${environment.apiUrl}/titres`);
    this.API_URL = `${environment.apiUrl}/titres`;
  }

  modifier(data: any, keyword: any){
    return this.http.put<any>(`${this.API_URL}/modifier-${keyword}/${data.idTitre}`, data);
  }

  afficher(id: number, keyword: any){
    return this.http.post<any>(`${this.API_URL}/afficher-${keyword}/${id}`, null);
  }
  afficherSelonTypeTitre(code: any){
    return this.http.get<any>(`${this.API_URL}/typetitre/${code}`);
  }

  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }

  afficherTousSelonQualite(dataTablesParameters: any, keyword: any, classname: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable-${keyword}/liste/${classname}`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }

  afficherToutesLesColonnesParTable(keyword: any){
    return this.http.get<any>(`${this.API_URL}/columns-${keyword}/name`);
  }

  creerFn(data: any, keyword: any){
    let result: any;
    switch (keyword.trim().toLowerCase()) {
      case 'obligations':
        result = this.obligationService.create(data);
        break;
      case 'actions':
        result = this.actionService.create(data);
        break;
      case 'autres':
        break;
      case 'droits':
        result = this.droitService.create(data);
        break;
      case 'tcn':
        result = this.tcnService.create(data);
        break;
      case 'opc':
        result = this.opcService.create(data);
        break;
      case 'dat':
        result = this.datService.create(data);
        break;
      default:
        result = this.create(data);
        break;
    }
    return result;
  }

  updateFn(data: any, keyword: any){
    let result: any;
    switch (keyword.trim().toLowerCase()) {
      case 'obligations':
        result = this.obligationService.update(data);
        break;
      case 'actions':
        result = this.actionService.update(data);
        break;
      case 'autres':
        break;
      case 'droits':
        result = this.droitService.update(data);
        break;
      case 'tcn':
        result = this.tcnService.update(data);
        break;
      case 'opc':
        result = this.opcService.update(data);
        break;
      case 'dat':
        result = this.datService.update(data);
        break;
      default:
        result = this.update(data);
        break;
    }
    return result;
  }

  afficherSelonId(id: number, keyword: any){
    let result: any;
    switch (keyword.trim().toLowerCase()) {
      case 'obligations':
        result = this.obligationService.getById(id);
        break;
      case 'actions':
        result = this.actionService.getById(id);
        break;
      case 'autres':
        break;
      case 'droits':
        result = this.droitService.getById(id);
        break;
      case 'tcn':
        result = this.tcnService.getById(id);
        break;
      case 'opc':
        result = this.opcService.getById(id);
        break;
      case 'dat':
        result = this.datService.getById(id);
        break;
      default:
        result = this.getById(id);
        break;
    }
    return result;
  }

  findBySymbole(symbole: string) {
    return this.http.post<any>(`${this.API_URL}/${symbole}`, null);
  }
}
