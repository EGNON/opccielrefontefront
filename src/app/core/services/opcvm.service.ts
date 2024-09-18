import {Injectable, OnDestroy} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {Opcvm} from "../models/opcvm";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OpcvmService extends ResourceService<Opcvm> implements OnDestroy{

  constructor(private http: HttpClient) {
    super(http, Opcvm, ``);
    this.API_URL = `${environment.apiUrl}/opcvms`;
  }

  ngOnDestroy(): void {
  }

  afficherTous(){
    return this.http.get<any>(`${this.API_URL}/liste`)
  }
}
