import {Inject, Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {EntityService} from "../../crm/services/entity.service";
import {DepotRachat} from "../models/depotrachat.model";
import {DataTablesResponse} from "../../crm/models/table.model";
import {Operationsouscriptionrachat} from "../models/operationsouscriptionrachat.model";
import {Operation} from "../models/operation.model";


@Injectable({
  providedIn: 'root'
})
export class OperationService extends EntityService<Operation> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/operations`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  afficherListeDepotRecenseSurAnnee(codeExercice:number)
  {
    return this.http.get<Operation[]>(`${this.API_URL}/depotsurannee/${codeExercice}`);
  }
  afficherListeDepotRecenseSurAnneeEtat(codeExercice:number)
  {
    return this.http.get<any>(`${this.API_URL}/depotsuranneeetat/${codeExercice}`
      ,{responseType: 'blob' as any }
    );
  }
  afficherOperationSupDixMillions(codeExercice:number)
  {
    return this.http.get<Operation[]>(`${this.API_URL}/operationsupdixmillions/${codeExercice}`);
  }
  afficherOperationSupDixMillionsEtat(codeExercice:number)
  {
    return this.http.get<any>(`${this.API_URL}/operationsupdixmillionsetat/${codeExercice}`
      ,{responseType: 'blob' as any }
    );
  }
  afficherOperationSupCinqMillions(codeExercice:number)
  {
    return this.http.get<Operation[]>(`${this.API_URL}/operationsupcinqmillions/${codeExercice}`);
  }
  afficherOperationSupCinqMillionsEtat(codeExercice:number)
    {
      return this.http.get<any>(`${this.API_URL}/operationsupcinqmillionsetat/${codeExercice}`
        ,{responseType: 'blob' as any }
      );
    }

  afficherOperationNouvelleRelationSupADixMillions(annee:number)
  {
    return this.http.get<Operation[]>(`${this.API_URL}/nouvellerelation/${annee}`);
  }
  afficherOperationNouvelleRelationSupADixMillionsEtat(annee:number)
  {
    return this.http.get<any>(`${this.API_URL}/nouvellerelationetat/${annee}`
      ,{responseType: 'blob' as any }
    );
  }
  afficherTransactionInhabituelle(annee:number)
  {
    return this.http.get<Operation[]>(`${this.API_URL}/transactioninhabituelle/${annee}`);
  }
  afficherTransactionInhabituelleEtat(annee:number)
  {
    return this.http.get<any>(`${this.API_URL}/transactioninhabituelleetat/${annee}`
      ,{responseType: 'blob' as any }
    );
  }
  afficherTransactionNormale(annee:number)
  {
    return this.http.get<Operation[]>(`${this.API_URL}/transactionnormale/${annee}`);
  }
  afficherTransactionNormaleEtat(annee:number)
  {
    return this.http.get<any>(`${this.API_URL}/transactionnormaleetat/${annee}`
      ,{responseType: 'blob' as any }
    );
  }

}
