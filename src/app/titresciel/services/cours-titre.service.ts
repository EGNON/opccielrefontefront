import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {CoursTitreModel} from "../models/cours-titre.model";
import { HttpClient } from "@angular/common/http";
import {TypeAmortissementModel} from "../models/type-amortissement.model";
import {environment} from "../../../environments/environment";
import {ResponseModel} from "../../crm/models/table.model";
import {ModeAmortissementModel} from "../models/mode-amortissement.model";

@Injectable({
  providedIn: 'root'
})
export class CoursTitreService extends ResourceService<CoursTitreModel>{
  constructor(private http: HttpClient) {
    super(http, CoursTitreModel, ``);
    this.API_URL = `${environment.apiUrl}/courstitres`;
  }

  afficherTous(codePlace: string, params: any){
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/place/${codePlace}`, params);
  }

  afficherCoursTitre(codePlace: string, params: any) {
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/maj/cours/${codePlace}`, params);
  }
 
   afficherPlaceCoursTitre(params: any){
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/place`, params);
  }

  afficherCoursTitreNew( params: any) {
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/maj/cours`, params);
  }

  verificationCours( params: any) {
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/verificationcours`, params);
  }
  validationCours( params: any) {
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/validationverificationcours`, params);
  }

  getLastCoursTitre(idTitre: number) {
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/dernier/cours/${idTitre}`, null);
  }

  saveAll(cours: any[], codePlace: string) {
    return this.http.post<ResponseModel<CoursTitreModel>>(`${this.API_URL}/add/collection/all${codePlace}`, cours);
  }
}
