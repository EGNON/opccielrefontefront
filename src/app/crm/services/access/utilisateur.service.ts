import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Utilisateur} from "../../models/access/utilisateur.model";
import {environment} from "../../../../environments/environment";
import {ResourceService} from "../core/resource.service";
import {Observable} from "rxjs";
import {DataTablesResponse} from "../../models/table.model";

@Injectable({
  providedIn: 'root'
})
/*export class UtilisateurService extends EntityService<Utilisateur> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/utilisateurs`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}*/

export class UtilisateurService extends ResourceService<Utilisateur> {
  constructor(private http: HttpClient) {
    super(http, Utilisateur, ``);
    this.API_URL = `${environment.apiUrl}/utilisateurs`;
  }

  afficherTous(dataTablesParameters: any): Observable<DataTablesResponse<any>> {
    const url = `${this.API_URL}/datatable/list`;
    return this.http.post<DataTablesResponse<any>>(url, dataTablesParameters);
  }

  afficherListeSimple() {
    const url = `${this.API_URL}`;
    return this.http.get<DataTablesResponse<any>>(url);
  }
}
