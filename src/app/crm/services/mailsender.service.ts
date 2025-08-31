import {Inject, Injectable, OnDestroy} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";
import {Mail} from "../models/mail.model";
import {MailSender} from "../models/mailsender.model";
import { ResourceService } from "./core/resource.service";

@Injectable({
  providedIn: 'root'
})
export class MailSenderService extends ResourceService<MailSender> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,MailSender,`${environment.apiUrl}/mailsender`);
    this.API_URL = `${environment.apiUrl}/mailsender`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  envoyerMailAUn(mailSender:MailSender):Observable<MailSender>
  {
    return this.http.post<MailSender>(this.API_URL + '/one',mailSender);
  }
  envoyerMailAUnAvecFichier(mailSender:MailSender):Observable<MailSender>
  {
    return this.http.post<MailSender>(this.API_URL + '/onewithfiles',mailSender);
  }
  envoyerMailAPlusieurs(mailSender:MailSender):Observable<MailSender>
  {
    return this.http.post<MailSender>(this.API_URL + '/many',mailSender);
  }
  envoyerMailAPlusieursAvecFichier(mailSender:MailSender):Observable<MailSender>
  {
    return this.http.post<MailSender>(this.API_URL + '/manywithfiles',mailSender);
  }
  envoyerMailAPlusieursAvecFichier2(mailSender:MailSender):Observable<MailSender>
  {
    return this.http.post<MailSender>(this.API_URL + '/manywithfiles2',mailSender);
  }
}
