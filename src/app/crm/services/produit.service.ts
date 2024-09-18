import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Produit} from "../models/produit.model";
import {EntityService} from "./entity.service";
import {DataTablesResponse} from "../models/data-tables.response.model";

@Injectable({
  providedIn: 'root'
})
export class ProduitService extends EntityService<Produit> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/produits`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherTous(datatableRequest: any)
  {
    return this.http.post<DataTablesResponse<Produit>>(`${this.API_URL}/datatable/list`, datatableRequest);
  }
  afficherListe()
  {
    return this.http.get<Produit>(`${this.API_URL}/liste`);
  }
  getEntityById(id: any)
  {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}
