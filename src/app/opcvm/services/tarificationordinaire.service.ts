import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Compartiment} from "../../core/models/compartiment.model";
import {ResourceService} from "../../crm/services/core/resource.service";
import {Natureevenement} from "../../core/models/natureevenement.model";
import {Soustypeaction} from "../../core/models/soustypeaction.model";
import {Typeaction} from "../../core/models/typeaction.model";
import {Typeemetteur} from "../../core/models/typeemetteur.model";
import {Place} from "../../core/models/place.model";
import {Banque} from "../../core/models/banque.model";
import {Tarificationordinaire} from "../models/tarificationordinaire.model";

@Injectable({ providedIn: 'root' })
export class TarificationordinaireService extends ResourceService<Tarificationordinaire> {
  constructor(private http: HttpClient) {
    super(http, Tarificationordinaire, `${environment.apiUrl}/tarificationordinaires`);
    this.API_URL = `${environment.apiUrl}/tarificationordinaires`;
  }
  afficherTous(){
    return this.http.get<any>(`${this.API_URL}`)
  }
  afficherTarificationSelonId(id:any,qualite:any){
    return this.http.get<any>(`${this.API_URL}/${qualite}/${id}`)
  }

}
