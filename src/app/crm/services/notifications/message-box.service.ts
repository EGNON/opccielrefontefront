import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from "../table.sevice";
import {MessageBox} from "../../models/message-box.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService extends TableService<MessageBox> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/messagesbox`;
  }

  ngOnDestroy(): void {
  }

  afficherTous()
  {
    return this.http.get<MessageBox[]>(`${this.API_URL}`);
  }
}
