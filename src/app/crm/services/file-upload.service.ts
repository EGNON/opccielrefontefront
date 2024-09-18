import {Inject, Injectable, OnDestroy} from '@angular/core';
import {environment} from "../../../environments/environment";
import {TableService} from "./table.sevice";
import {HttpClient} from "@angular/common/http";
import {PieceJointe} from "../models/piece-jointe.model";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService extends TableService<PieceJointe> implements OnDestroy {
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/documents`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getFiles(){
    return this.http.get<Document[]>(`${this.API_URL}/tous`);
  }
  getFilesInByte(id:number)
  {
    return this.http.get(`${this.API_URL}/upload/${id}`,{responseType : 'blob'})
  }
  afficherDocumentSelonRDV(idRdv:number){
    return this.http.get<PieceJointe[]>(`${this.API_URL}/rdv/`+idRdv);
  }
  afficherDocumentSelonCR(idCr:number){
    return this.http.get<PieceJointe[]>(`${this.API_URL}/compterendu/`+idCr);
  }
  afficherDocumentSelonPersonne(idPersonne:number){
    return this.http.get<PieceJointe[]>(`${this.API_URL}/personne/`+idPersonne);
  }
  supprimerDocumentSelonRDV(idRdv:number){
     return this.http.delete<PieceJointe>(`${this.API_URL}/rdv/`+idRdv);
  }
}
