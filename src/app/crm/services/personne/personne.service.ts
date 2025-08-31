import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Personne} from "../../models/personne/personne.model";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import { ResourceService } from '../core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class PersonneService extends ResourceService<Personne> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,Personne,`${environment.apiUrl}/personnes`);
    this.API_URL = `${environment.apiUrl}/personnes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherPersonneListe():Observable<Personne[]>
  {
    return this.http.get<Personne[]>(environment.apiUrl + '/personnephysiquemorales');
  }
  afficherPersonnePhysiqueMorale():Observable<Personne[]>
  {
    return this.http.get<Personne[]>(environment.apiUrl + '/personnephysiquemorales/tous');
  }

  afficherPersonneNotInOpcvm(idOpcvm:number):Observable<Personne[]>
  {
    return this.http.get<Personne[]>(this.API_URL + `/personnenotinopcvm/${idOpcvm}`);
  }
  afficherPersonneInOpcvm(idOpcvm:number):Observable<Personne[]>
  {
    return this.http.get<Personne[]>(this.API_URL + `/personneinopcvm/${idOpcvm}`);
  }
  afficherPersonneInOpcvmEtStatutCompte(idOpcvm:number):Observable<Personne[]>
  {
    return this.http.get<Personne[]>(this.API_URL + `/personneinopcvmstatutcompte/${idOpcvm}`);
  }
  afficherPersonneSelonId(id:number){
    return this.http.get<Personne>(environment.apiUrl + '/personnes/'+id);
  }
  afficherPersonneSelonNumeroCpteDepositaire(numero:string){
    return this.http.get<Personne[]>(environment.apiUrl + '/personnes/verifiernumerocptedepositaire/'+numero);
  }
  rechercherParSigle(sigle: string) {
    return this.http.post<any>(this.API_URL + `/rechercherpar/sigle-${sigle}`, null);
  }
  afficherPersonneSelonQualite(keyword: any){
    const url = `${this.API_URL}/qualite/${keyword}`;
    return this.http.get<Personne[]>(url);
  }
  afficherPersonneExposeJuge(){
    const url = `${this.API_URL}/exposejuge`;
    return this.http.get<Personne[]>(url);
  }
  afficherCompteGele(dataTablesParameters: any){
    const url = `${this.API_URL}/datatable/list/gele`;
    return this.http.post<Personne[]>(url,dataTablesParameters);
  }
  afficherCompteNonGele(dataTablesParameters: any){
    const url = `${this.API_URL}/datatable/list/nongele`;
    return this.http.post<Personne[]>(url,dataTablesParameters);
  }
  afficherCompteGeleNonGele(dataTablesParameters: any){
    const url = `${this.API_URL}/datatable/list`;
    return this.http.post<Personne[]>(url,dataTablesParameters);
  }
  existeSelonNumCpteDeposit(keyword: string) {
    const url = `${this.API_URL}/existance/${keyword}/compte`;
    return this.http.post<Personne[]>(url, null);
  }
}
