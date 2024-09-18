import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";

@Component({
  selector: 'app-personne-morale-show',
  templateUrl: './personne-morale-show.component.html',
  styleUrls: ['./personne-morale-show.component.scss']
})
export class PersonneMoraleShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;

  subscriptions: Subscription[] = [];

  constructor(
    private pageInfo: PageInfoService,
    private route: ActivatedRoute,
    private entityService: PersonneMoraleService,) {
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    //Récupération de l'object correspondant à id
    const paramSubscription = this.route.paramMap
      .pipe(
        // filter(paramMap => paramMap.has('id')),
        map(paramMap => {
          let params: any = new Array(2);
          if(paramMap.has('id'))
            params[0] = +paramMap.get('id')!;
          if(paramMap.has('etat'))
            params[1] = +paramMap.get('etat')! == 1;
          else
            params[1] = false;

          return params;
        }),
        tap((params) => {
          this.id = params[0];
        }),
        filter(params => params[0]!),
        switchMap(params => this.entityService.getEntityById(params[0]))
      ).subscribe(entity => {
        this.entity = entity;
        this.pageInfo.updateTitle("Détail de " + entity.denomination);
      });
    this.subscriptions.push(paramSubscription);
  }
}
