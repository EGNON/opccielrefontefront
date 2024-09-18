import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "../table.sevice";
import {HttpClient} from "@angular/common/http";
import {PersonnePhysique} from "../../models/personne/personne.physique.model";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse, ResponseModel} from "../../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class PersonnePhysiqueService extends TableService<PersonnePhysique> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/personnephysiques`;
  }

  afficherTous()
  {
    return this.http.get<ResponseModel<PersonnePhysique>>(environment.apiUrl + '/personnephysiques/tous');
  }

  afficherSelonIdQualite(id: number, qualite: string)
  {
    return this.http.get<PersonnePhysique>(`${this.API_URL}/statut/${qualite}-${id}`)
  }
  afficherPersonnePhysiqueNayantPasInvesti (qualite: string,dateDebut:Date,dateFin:Date )  {
    const url = `${this.API_URL}/investi/`+qualite+'/'+dateDebut+'/'+dateFin;
    return this.http.get<PersonnePhysique[]>(url);
  }

  getEntityById(id: any): Observable<PersonnePhysique> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<PersonnePhysique>(url);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getPersonnes(dataTablesParameters: any, keyword: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable-${keyword}/list`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }
  getPersonneSanctionnee(dataTablesParameters: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable/physiquesanctionnee`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }

  afficherPersonneSelonQualite(keyword: any){
    const url = `${this.API_URL}/qualite/${keyword}`;
    return this.http.get(url);
  }

  afficherPersonnePhysiqueListe():Observable<PersonnePhysique>
  {
    return this.http.get<PersonnePhysique>(environment.apiUrl + '/personnephysiques');
  }

  afficherPersonnePhysiqueSelonId(id:number):Observable<PersonnePhysique>
  {
    return this.http.get<PersonnePhysique>(environment.apiUrl + '/personnephysiques/'+id);
  }

  createFn(formData: any) {
    return this.http.post<any>(`${this.API_URL}/uploads/file`, formData);
  }

  updateFn(formData: any, id: any) {
    return this.http.put<any>(`${this.API_URL}/uploads/file-${id}`, formData);
  }
  deleteByPersonneAndQualite(idPersonne:number,idQualite:number):Observable<PersonnePhysique>
  {
    return this.http.delete<PersonnePhysique>(environment.apiUrl + `/personnephysiques/${idPersonne}/${idQualite}`);
  }
}
