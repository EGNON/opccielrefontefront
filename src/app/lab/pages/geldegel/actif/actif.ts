/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import moment from 'moment';
import { Subscription, map, tap } from 'rxjs';
import { Place } from '../../../../core/models/place.model';
import { CoursTitreService } from '../../../../titresciel/services/cours-titre.service';
import { LocalService } from '../../../../services/local.service';
import { LibrairiesService } from '../../../../services/librairies.service';

@Component({
  selector: 'app-actif',
  standalone: false,
  templateUrl: './actif.html',
  styleUrl: './actif.scss'
})
export class Actif implements OnInit, OnDestroy{
  idActionnaire: number;
  dateDebut: Date;
  dateFin: Date;
  actif$: any;
  bouton: string;
  submitting: boolean;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  //DataTable Config
  datatableConfig: Config = {};
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  //Get all subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private coursTitreService: CoursTitreService,
    private librairieService: LibrairiesService,
    public localStore: LocalService) {
  }

  close() {
    this.modal.dismiss();
  }

  btnScripts(n: any) {
    this.passEntry.emit(n);
    this.modal.dismiss();
  }

  ngOnInit(): void {
    const self = this;
    const dates = {
      startDate: new Date(this.dateDebut),
      endDate: new Date(this.dateFin)
    };
    console.log("Dates === ", dates);
    const columns: any[] = [
      {
        title: 'DESIGNATION', data: 'denominationOpcvm', render: function (data, type, row) {
          return data;
        },
      },
      {
        title: 'VALO INITIALE', data: 'valoInitial', render: function (data, type, row) {
          return data;
        },
      },
      {
        title: 'TOTAL SOUSCRIPTION', data: 'totalSouscription', render: function (data, type, row) {
          return data;
        },
      },
      {
        title: 'TOTAL RACHAT', data: 'totalRachat', render: function (data, type, row) {
          return data;
        },
      },
      {
        title: 'COUPON PAYE', data: 'couponPaye', render: function (data, type, row) {
          return data;
        },
      },
      /* {
        sortable: false,
        title: 'Actions',
        class:'text-end min-w-10px',
        render: (data: any, type: any, full: any) => {
          return `<button class="btn btn-primary btn-sm">Choisir</button>`;
        },
      } */
    ];
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        const params = {
          datatableParameters: dataTablesParameters,
          dateDebutEstimation:new Date("1980/01/01"),
          dateEstimation:new Date(this.dateFin),
          idActionnaire:this.idActionnaire,
          idOpcvm:null
          //beginEndDateParameter: dates
        };
        console.log(params)
        const sb = this.librairieService.portefeuilleActionnaire(params).pipe(
          map(resp => resp.data),
          tap(value => console.log("CoursTitres === ", value))
        ).subscribe(data => {
          callback(data);
        });
        this.subscriptions.push(sb);
      },
      columns: columns,
      createdRow: function (row, data, dataIndex) {
       // $(row).find('.btn').on('click', () => self.btnScripts(data));
      },
    };
    this.changeTableEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  enregistrer(){
      this.btnScripts(this.dateFin)
  }
}
