import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReportingsService} from "../../../services/reportings/reportings.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {first} from "rxjs/operators";
import 'datatables.net';
// import 'datatables.net-buttons/js/dataTables.buttons';
// import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import $ from "jquery";
import moment from "moment/moment";

@Component({
  selector: 'app-volatilite',
  templateUrl: './volatilite.component.html',
  styleUrl: './volatilite.component.scss'
})
export class VolatiliteComponent implements OnInit, AfterViewInit{
  @ViewChild('datatable') tableRef: ElementRef;
  dtOptions: any = {};
  datatable: any;
  form: FormGroup;

  constructor(
    private reportingsService: ReportingsService,
    private fb: FormBuilder) {
  }

  ngOnDestroy(): void {
    //this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    let today = new Date();
    let dateDebut = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    let dateFin = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.form = this.fb.group({
      startDate: [dateDebut],
      endDate: [dateFin],
    });
    this.dtOptions = {
      ...this.reportingsService.dtOptions
    }
    this.loadData();
  }

  initDatatable(tableId: any) {
    let $  = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      order: [0, 'desc'],
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
        { title: "#" },
        { title: "ID OPCVM" },
        { title: "SIGLE OPCVM" },
        { title: "DENOMINATION" },
        { title: "DATE N1" },
        { title: "ANNEE N1" },
        { title: "SEANCE N1" },
        { title: "VL N1" },
        {
          title: "DATES", data: null, render: function (data: any, type: any, row: any) {
            return moment(data[8]).format('DD/MM/YYYY');
          }
        },
        { title: "ANNEE N2" },
        { title: "SEANCE N2" },
        { title: "VL" },
        { title: "PERFORMANCE N1" },
        { title: "PERFORMANCE" },
        { title: "RENTABILITE MOYENNE %" },
        { title: "VARIANCE" },
        { title: "ECART TYPE (VOLATILITE)" },
        { title: "ECART TYPE BASE DE 100" }
      ],
      rowCallback: (row: any, data: any) => {
        console.log("EEEEEEEEEEEE === ", data[8]);
        if (data[4] == 'A') {
          $('td:eq(4)', row).html('<b>A</b>');
        }
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
    datatable.columns([1,2,4,5,6,7,9,10,12]).visible( false );

    return datatable;
  }

  loadData() {
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
    console.log("TABLE === ", $('#datatable'));
    this.reportingsService.volatilite(null, dates)
      .pipe(first())
      .subscribe(data => {
        this.datatable = this.initDatatable("datatable");
        this.datatable.clear().rows.add(data).draw();
      });
  }

  onSubmit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
  }
}
