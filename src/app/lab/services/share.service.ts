
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, Subject} from "rxjs";
import {EntityService} from "../../crm/services/entity.service";
import {DepotRachat} from "../models/depotrachat.model";
import {DataTablesResponse} from "../../crm/models/table.model";
import {Exercice} from "../models/exercice.model";


@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private subject = new Subject<any>();
  private subjectNouvellerelation = new Subject<any>();
  private subjectRecenseSurAnnee = new Subject<any>();
  private subjectCinq = new Subject<any>();
  private subjectConditionInhabituelle = new Subject<any>();
  private subjectConditionNormale = new Subject<any>();
  sendClickEvent() {
    this.subject.next(this);
  }
  getClickEvent(): Observable<any>{
    return this.subject.asObservable();
  }

  sendClickEventNouvelleRelation() {
    this.subjectNouvellerelation.next(this);
  }
  getClickEventNouvelleRelation(): Observable<any>{
    return this.subjectNouvellerelation.asObservable();
  }
  sendClickEventRecenseSurAnnee() {
    this.subjectRecenseSurAnnee.next(this);
  }
  getClickEventRecenseSurAnnee(): Observable<any>{
    return this.subjectRecenseSurAnnee.asObservable();
  }
  sendClickEventCinq() {
    this.subjectCinq.next(this);
  }
  getClickEventCinq(): Observable<any>{
    return this.subjectCinq.asObservable();
  }
  sendClickEventConditionInhabituelle() {
    this.subjectConditionInhabituelle.next(this);
  }
  getClickEventConditionInhabituelle(): Observable<any>{
    return this.subjectConditionInhabituelle.asObservable();
  }
  sendClickEventConditionNormale() {
    this.subjectConditionNormale.next(this);
  }
  getClickEventConditionNormale(): Observable<any>{
    return this.subjectConditionNormale.asObservable();
  }
}
