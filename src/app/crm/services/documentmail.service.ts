import {Inject, Injectable, OnDestroy} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import {DocumentMail} from "../models/documentmail.model";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentmailService extends ResourceService<DocumentMail> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,DocumentMail,`${environment.apiUrl}/documentmails`);
    this.API_URL = `${environment.apiUrl}/documentmails`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherDocumentMailSelonMail(idMail:number):Observable<DocumentMail[]>
  {
    return this.http.get<DocumentMail[]>(environment.apiUrl + '/documentmails/'+idMail);
  }
  supprimerDocumentMailSelonMail(idMail:number):Observable<DocumentMail>
  {
    return this.http.delete<DocumentMail>(environment.apiUrl + '/documentmails/'+idMail);
  }
}
