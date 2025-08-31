import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {Qualite} from "../../../../crm/models/qualite.model";

@Component({
    selector: 'app-morale-showing',
    templateUrl: './morale-showing.component.html',
    styleUrl: './morale-showing.component.scss',
    standalone: false
})
export class MoraleShowingComponent implements OnInit, OnDestroy{
  @Input() _qualite: Qualite;
  qualite: string;
  @Input() id?: number;
  entity: any;

  subscriptions: Subscription[] = [];

  @Output() showForm: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private pageInfo: PageInfoService,
    private route: ActivatedRoute,
    private entityService: PersonneMoraleService,) {
  }
  ngOnDestroy(): void {
    this.showForm.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    //Récupération de l'object correspondant à id
    //Récupération de l'object correspondant à id
    if(this.id)
    {
      this.entityService.getEntityById(this.id).subscribe((entity) => {
        this.entity = entity;
        this.pageInfo.updateTitle("Détail de " + entity.denomination);
      });
    }
  }

  retourAlaListe() {
    this.showForm.emit(0);
  }
}
