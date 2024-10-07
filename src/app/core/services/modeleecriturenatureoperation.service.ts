import { Injectable } from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Modeleecriturenatureoperation} from "../models/modeleecriturenatureoperation.model";

@Injectable({
  providedIn: 'root'
})
export class ModeleecriturenatureoperationService extends ResourceService<Modeleecriturenatureoperation>{
  constructor(private http: HttpClient) {
    super(http, Modeleecriturenatureoperation, '');
    this.API_URL = `${environment.apiUrl}/modeleecriturenatureoperations`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherSelonId(codeModele:string,codeNature:string,codeTypeTitre:string){
    return this.http.get<any>(`${this.API_URL}/${codeModele}/${codeNature}/${codeTypeTitre}`)
  }
  update2(codeModele:string,codeNature:string,codeTypeTitre:string,modeleNatureOperation:any){
    return this.http.put<any>(`${this.API_URL}/${codeModele}/${codeNature}/${codeTypeTitre}`,modeleNatureOperation)
  } 
  supprier(codeModele:string,codeNature:string,codeTypeTitre:string){
    return this.http.delete<any>(`${this.API_URL}/${codeModele}/${codeNature}/${codeTypeTitre}`)
  }
}
