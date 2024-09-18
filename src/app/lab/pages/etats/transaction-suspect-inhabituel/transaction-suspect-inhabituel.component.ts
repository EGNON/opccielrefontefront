import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription, tap} from "rxjs";
import {ReportingsService} from "../../../services/reportings/reportings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import moment from "moment";
import {first} from "rxjs/operators";
import 'datatables.net';
// import 'datatables.net-buttons/js/dataTables.buttons';
// import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';

export class TransactionSuspecteInhabituelle {
  typePersonne: string;
  opMontantTransac: string;
  montantTransac: number;
  opQtePart: string;
  qtePart: number;
}

@Component({
  selector: 'app-transaction-suspect-inhabituel',
  templateUrl: './transaction-suspect-inhabituel.component.html',
  styleUrl: './transaction-suspect-inhabituel.component.scss'
})
export class TransactionSuspectInhabituelComponent implements OnInit, OnDestroy, AfterViewInit{
  datatable: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList: any[] = [];
  form: FormGroup;
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;

  constructor(
    private cr: ChangeDetectorRef,
    private reportingsService: ReportingsService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      typePersonne: ["tous", Validators.required],
      opMontantTransac: ["=", Validators.required],
      montantTransac: [null],
      opQtePart: ["=", Validators.required],
      qtePart: [null]
    });
    this.dtOptions = {...this.reportingsService.dtOptions};
    this.loadData();
  }

  ngOnDestroy(): void {}

  initDatatable(tableId: any) {
    let $  = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      order: [0, 'desc'],
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      processing: true,
      // fixedHeader: true,
      // paging: false,
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
          title: "ID ACTIONNAIRE", data: null, render: function (data: any, type: any, row: any) {
            return data[0];
          }
        },
        {
          title: "DATE OP.", data: null, render: function (data: any, type: any, row: any) {
            return moment(data[1]).format('DD/MM/YYYY');
          }
        },
        {
          title: "TYPE PERSONNE", data: null, render: function (data: any, type: any, row: any) {
            return data[6];
          }
        },
        {
          title: "ID OPCVM", data: null, render: function (data: any, type: any, row: any) {
            return data[2];
          }
        },
        {
          title: "MONTANT DEPOSE", data: null, render: function (data: any, type: any, row: any) {
            return data[3].toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          }
        },
        {
          title: "ACTIONNAIRE", data: null, render: function (data: any, type: any, row: any) {
            return data[4];
          }
        },
        {
          title: "FCP", data: null, render: function (data: any, type: any, row: any) {
            return data[5];
          }
        },
        {
          title: "NBR PART", data: null, render: function (data: any, type: any, row: any) {
            return data[7].toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          }
        }
      ],
      drawCallback: function (settings:any) {
        let api = this.api();
        let rows = api.rows({page:'current'} ).nodes();
        // $("body").addClass("loading");
        //console.log("ROWS === ", settings);
      },
      rowCallback: (row: any, data: any) => {
        // if (data[4] == 'A') {
        //   $('td:eq(4)', row).html('<b>A</b>');
        // }
      },
      initComplete: function () {
        console.log('@@@ init complete @@@');
        $("body").removeClass("loading");

        /*// Select the column whose header we need replaced using its index(0 based)
        this.api().column(2).every(function() {
          var column = this;
          // Put the HTML of the <select /> filter along with any default options
          var select = $('<select class="form-control input-sm"><option value="">All</option></select>')
            // remove all content from this column's header and
            // append the above <select /> element HTML code into it
            .appendTo($(column.header()).empty())
            // execute callback when an option is selected in our <select /> filter
            .on('change', function() {
              // escape special characters for DataTable to perform search
              var val = $.fn.dataTable.util.escapeRegex(
                $(this).val()
              );

              // Perform the search with the <select /> filter value and re-render the DataTable
              column
                .search(val ? '^' + val + '$' : '', true, false)
                .draw();
            });
          // fill the <select /> filter with unique values from the column's data
          column.data().unique().sort().each(function(d, j) {
            select.append("<option value='" + d + "'>" + d + "</option>")
          });
        });*/
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
    datatable.columns([0,3]).visible( false);

    return datatable;
  }

  onSubmit() {
    console.log("FORM === ", this.form);
    this.loadData(true);
  }

  loadData(submitted = false) {
    this.reportingsService.transactionSuspectInhabituel(this.form.value)
      .pipe(first())
      .subscribe(data => {
        this.datatable = this.initDatatable("datatable");
        this.datatable.clear().rows.add(data).draw();
      });
  }

  rebindDataTable() {
    this.datatableElement.dtInstance.then(x => x.draw());
  }

  rerender(): void {
    this.datatableElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {}
}
