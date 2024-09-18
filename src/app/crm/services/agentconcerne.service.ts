import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AgentConcerne} from "../models/agentconcerne.model";
import {TableService} from "./table.sevice";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AgentConcerneService extends TableService<AgentConcerne> implements OnDestroy{
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
    this.API_URL = `${environment.apiUrl}/agentconcernes`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  saveAgent(agentConcerne:AgentConcerne):Observable<AgentConcerne>
  {
    return this.http.post<AgentConcerne>(environment.apiUrl + '/agentconcernes',agentConcerne);

  }
 save(agentConcerne:AgentConcerne[]):Observable<AgentConcerne>
  {
    return this.http.post<AgentConcerne>(environment.apiUrl + '/agentconcernes/group',agentConcerne);

  }

  updateAgent(agentConcerne: AgentConcerne, idPersonnel: number, idRdv: undefined | number):Observable<AgentConcerne>
  {
    return this.http.put<AgentConcerne>(environment.apiUrl + '/agentconcernes/update/'+idPersonnel+'/'
      +idRdv,agentConcerne);

  }
  afficherAgentConcerneSelonRRDV(idRdv:number):Observable<AgentConcerne[]>
  {
    return this.http.get<AgentConcerne[]>(environment.apiUrl + '/agentconcernes/'+idRdv);

  }
  afficherAgentConcerneSelonPersonnel(idPersonnel:number):Observable<AgentConcerne[]>
  {
    return this.http.get<AgentConcerne[]>(environment.apiUrl + '/agentconcernes/personnel/'+idPersonnel);

  }
  supprimerAgentConcerneSelonRDV(idRdv:number):Observable<AgentConcerne>
  {
    return this.http.delete<AgentConcerne>(environment.apiUrl + '/agentconcernes/'+idRdv);

  }
}
