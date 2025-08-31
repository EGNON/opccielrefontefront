import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Place} from "../../../../core/models/place.model";
import {CoursTitreService} from "../../../services/cours-titre.service";
import {map} from "rxjs/operators";
import {Subscription, tap} from "rxjs";
import {Config} from "datatables.net";
import moment from "moment";
import $ from "jquery";

@Component({
    selector: 'app-date-cours',
    templateUrl: './date-cours.component.html',
    styleUrl: './date-cours.component.scss',
    standalone: false
})
export class DateCoursComponent implements OnInit, OnDestroy{
  place: Place;
  dateDebut: Date;
  dateFin: Date;
  coursTitres$: any;
  [key: string]: any;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  //DataTable Config
  datatableConfig: Config = {};
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  //Get all subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private coursTitreService: CoursTitreService) {
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
        title: 'DATE', data: 'dateCours', render: function (data, type, row) {
          return moment(data).format('DD/MM/YYYY');
        },
      },
      {
        sortable: false,
        title: 'Actions',
        class:'text-end min-w-10px',
        render: (data: any, type: any, full: any) => {
          return `<button class="btn btn-primary btn-sm">Choisir</button>`;
        },
      }
    ];
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        const params = {
          datatableParameters: dataTablesParameters,
          beginEndDateParameter: dates
        };
        const sb = this.coursTitreService.afficherTous(this.place.codePlace, params).pipe(
          map(resp => resp.data),
          tap(value => console.log("CoursTitres === ", value))
        ).subscribe(data => {
          callback(data);
        });
        this.subscriptions.push(sb);
      },
      columns: columns,
      createdRow: function (row, data, dataIndex) {
        $(row).find('.btn').on('click', () => self.btnScripts(data));
      },
    };
    this.changeTableEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
