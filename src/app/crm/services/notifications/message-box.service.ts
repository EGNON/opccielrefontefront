import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "../table.sevice";
import {MessageBox} from "../../models/message-box.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import { ResourceService } from '../core/resource.service';

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService extends ResourceService<MessageBox> implements OnDestroy{
  constructor(private http: HttpClient) {
    super(http,MessageBox,`${environment.apiUrl}/messagesbox`);
    this.API_URL = `${environment.apiUrl}/messagesbox`;
  }

  ngOnDestroy(): void {
  }

  afficherTous()
  {
    return this.http.get<MessageBox[]>(`${this.API_URL}`);
  }
}
