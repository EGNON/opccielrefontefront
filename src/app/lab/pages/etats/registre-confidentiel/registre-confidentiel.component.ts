import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {ReportingsService} from "../../../services/reportings/reportings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DataTableDirective} from "angular-datatables";
import moment from "moment/moment";
import {first} from "rxjs/operators";
import 'datatables.net';
// import 'datatables.net-buttons/js/dataTables.buttons';
// import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import {Config} from "datatables.net";

@Component({
  selector: 'app-registre-confidentiel',
  templateUrl: './registre-confidentiel.component.html',
  styleUrl: './registre-confidentiel.component.scss'
})
export class RegistreConfidentielComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;
  //dtOptions: any = {};
  datatable: any;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList$: Observable<any>;
  reportList: any = [];
  form: FormGroup;

  constructor(
    private reportingsService: ReportingsService,
    private fb: FormBuilder) {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    let today = new Date();
    let dateDebut = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    let dateFin = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.form = this.fb.group({
      startDate: [dateDebut],
      endDate: [dateFin],
    });
    let groupColumn = 3;
    this.dtOptions = {
      ...this.reportingsService.dtOptions,
      pageLength: 2,
      columnDefs: [{visible: false, targets: groupColumn}],
      order: [[groupColumn, 'asc']],
      /*drawCallback: function (settings:any) {
        let api = this.api();
        let rows = api.rows({page:'current'} ).nodes();
        let last: any = null;
        api.column(groupColumn, {page:'current'} ).data().each(function (group: any, i: any) {
          if (last !== group) {
            $(rows).eq(i).before(
              '<tr style="background-color:#49bbf1" class="group"><th colspan="9">'+group+'</th></tr>'
            );
            last = group;
          }
        });
      }*/
    };
    this.loadData();
  }

  initDatatable(tableId: any) {
    let $  = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      // columnDefs: [{visible: false, targets: 5}],
      order: [5, 'asc'],
      drawCallback: function (settings:any) {
        let api = this.api();
        let rows = api.rows({page:'current'} ).nodes();
        console.log("ROWS === ", settings);
        let last: any = null;
        api.column(5, {page:'current'} ).data().each(function (group: any, i: any) {
          //console.log(group[9], i);
          console.log(last, group[9], i);
          if (last !== group[9]) {
            $(rows).eq(i).before(
              '<tr style="background-color:#49bbf1" class="group"><th colspan="9">'+group[9]+'</th></tr>'
            );
            last = group[9];
          }
        });
      },
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
      data: [],
      columns: [
        {
          title: "ID OPCVM", data: null, render: function (data: any, type: any, row: any) {
            return data[0];
          }
        },
        {
          title: "ID ACTIONNAIRE", data: null, render: function (data: any, type: any, row: any) {
            return data[2];
          }
        },
        {
          title: "Date op.", data: null, render: function (data: any, type: any, row: any) {
            return moment(data[4]).format('DD/MM/YYYY');
          }
        },
        {
          title: "Origine et Destination des fonds", data: null, render: function (data: any, type: any, row: any) {
            return '-';
          }
        },
        {
          title: "Objet et Modalités", data: null, render: function (data: any, type: any, row: any) {
            return '-';
          }
        },
        {
          title: "Nature de l'opération", data: null, render: function (data: any, type: any, row: any) {
            return data[9];
          }
        },
        {
          title: "Existence d’une justification économique", data: null, render: function (data: any, type: any, row: any) {
            return '-';
          }
        },
        {
          title: "Cohérence de la justification économique", data: null, render: function (data: any, type: any, row: any) {
            return '-';
          }
        },
        {
          title: "Identité du donneur d’ordre", data: null, render: function (data: any, type: any, row: any) {
            return data[3];
          }
        },
        {
          title: "Identité du bénéficiaire effectif", data: null, render: function (data: any, type: any, row: any) {
            return data[3];
          }
        },
        {
          title: "Devise", data: null, render: function (data: any, type: any, row: any) {
            return '-';
          }
        },
        {
          title: "Montant", data: null, render: function (data: any, type: any, row: any) {
            return data[5].toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          }
        },
      ],
      rowCallback: (row: any, data: any) => {
        // if (data[4] == 'A') {
        //   $('td:eq(4)', row).html('<b>A</b>');
        // }
      },
      initComplete: function () {
        console.log('@@@ init complete @@@');
        $("body").removeClass("loading");
      },
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Chargement...',
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
      retrieve: true,
      stateSave: true,
      destroy: true
    });
    datatable.columns([0,1,5]).visible( false);

    return datatable;
  }

  loadData(submitted = false) {
    let startDate: any;
    let endDate: any;
    if (this.form.controls.startDate.value) {
      startDate = new Date(
        this.form.controls.startDate.value.year,
        this.form.controls.startDate.value.month - 1,
        this.form.controls.startDate.value.day + 1);
    }
    if (this.form.controls.endDate.value) {
      endDate = new Date(
        this.form.controls.endDate.value.year,
        this.form.controls.endDate.value.month - 1,
        this.form.controls.endDate.value.day + 1);
    }
    let dates = {startDate: startDate, endDate: endDate};
    console.log("DATES === ", dates);
    this.reportingsService.registreConfidentiel(dates)
      .pipe(first())
      .subscribe(data => {
        this.datatable = this.initDatatable("datatable");
        this.datatable.clear().rows.add(data).draw();
      });
  }

  onSubmit() {
    this.loadData();
  }

  ngAfterViewInit(): void {}
}
