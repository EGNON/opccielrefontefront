import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { first, Observable, Subject, Subscription } from 'rxjs';
import { OpcvmService } from '../../../../core/services/opcvm.service';
import { ReportingsService } from '../../../services/reportings/reportings.service';

@Component({
  selector: 'app-ratiotreynor',
  templateUrl: './ratiotreynor.component.html',
  styleUrl: './ratiotreynor.component.scss'
})
export class RatiotreynorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;
  isDtInit: boolean = false
  dataTable: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList$: Observable<any>;
  selectOpcvm: any;
  submitted = false;
  idOpcvm: any;
  opcvm$: any;
  reportList: any[] = [];
  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    private cr: ChangeDetectorRef,
    private reportingsService: ReportingsService,
    private opcvmService: OpcvmService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      denominationOpcvm: [null, Validators.required],
      annee: [null, Validators.required],
      rf: [null, Validators.required],
      rtp: [null]
    });
    this.submitted = false;
    this.afficherOpcvm()
    this.dtOptions = {...this.reportingsService.dtOptions};
    //console.log("INIT === ", this.form.value);
    // this.loadData();
  }

  valider() {
    this.loadData()
  }

  public dtInit(): void {
    if (this.isDtInit) {
      this.datatableElement.dtInstance.then(dtInstance => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else this.isDtInit = true;
  }

  initDatatable(tableId: any) {
    let $ = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      // columnDefs: [{visible: false, targets: 5}],
      order: [],
      drawCallback: function (settings: any) {
        let api = this.api();
        //   let rows = api.rows({page:'current'} ).nodes();
        //   console.log("ROWS === ", settings);
        //   let last: any = null;
        //   api.column(5, {page:'current'} ).data().each(function (group: any, i: any) {
        //     //console.log(group[9], i);
        //     console.log(last, group[9], i);
        //     if (last !== group[9]) {
        //       $(rows).eq(i).before(
        //         '<tr style="background-color:#49bbf1" class="group"><th colspan="9">'+group[9]+'</th></tr>'
        //       );
        //       last = group[9];
        //     }
        //   });
      },
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend: 'copy',
          text: '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm'
        },
        {
          extend: 'csv',
          text: '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'excel',
          text: '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print"></i> Imprimer',
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
          title: "DATE .", data: 'dateFermeture', render: function (data: any, type: any, row: any) {
            let daterecup: string[];
            let mois: number;
            let libelleMois: string;
            daterecup = row.dateFermeture;
            mois = Number(daterecup[1]);
            libelleMois = daterecup[1]
            if (mois < 10)
              libelleMois = "0" + daterecup[1];
            //console.log(daterecup)
            //return daterecup[2]+"/"+libelleMois+"/"+daterecup[0];//moment(data).format('DD/MM/YYYY');
            return moment(row.dateFermeture).format('DD/MM/YYYY');
          }
        },
        {
          title: "VL", data: 'vl', render: function (data: any, type: any, row: any) {
            return row.vl;
          }
        },
        {
          title: "Dividende distribuée", data: 'dividendeDistribue', render: function (data: any, type: any, row: any) {
            return row.dividendeDistribue;
          }
        },
        {
          title: "Performance annuelle",
          data: 'performanceAnnuelle',
          render: function (data: any, type: any, row: any) {
            return row.performanceAnnuelle;
          }
        },
        {
          title: "Volatilité annualisée",
          data: 'volatiliteAnnualisee',
          render: function (data: any, type: any, row: any) {
            return row.volatiliteAnnualisee;
          }
        },
        {
          title: "Ratio de sharp", data: 'sharp', render: function (data: any, type: any, row: any) {
            return row.sharp;
          }
        }
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
    datatable.columns([0, 1, 5]).visible(true);

    return datatable;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  onSubmit() {
    console.log("FORM === ", this.form);
    this.loadData(true);
    /*this.dtOptions = this.reportingsService.dtOptions;
    this.dataTable.DataTable(this.dtOptions);*/
  }

  loadData(submitted = false) {
    this.submitted = true;
    this.selectOpcvm = document.getElementById('ComboOpcvmRatioTreynor')
    this.idOpcvm = this.selectOpcvm.options[this.selectOpcvm.selectedIndex].value;

    //console.log("opcvm="+this.idOpcvm+";annee"+this.form.value.annee+";"+this.form.value.rf)
    this.reportingsService.ratioTreynor(this.idOpcvm,
      this.form.value.annee,
      this.form.value.rf.replace(',','.'))
      .pipe(first())
      .subscribe(data => {
      //  console.log(data)
          this.form.patchValue({rtp:data.rtp})
          this.submitted = false;
      });
    // this.subscriptions.push(sb);
  }
  get f() { return this.form.controls; }
  afficherOpcvm() {
    this.opcvmService.afficherTous().subscribe(
      (data) => {
        this.opcvm$ = data.data;
      }
    )
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

  ngAfterViewInit(): void {
    //this.dtTrigger.next(null);
  }
}
