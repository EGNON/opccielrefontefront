import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportingsService} from "../../../services/reportings/reportings.service";
import {OpcvmService} from "../../../../core/services/opcvm.service";
import $ from "jquery";
import moment from "moment/moment";
import {first} from "rxjs/operators";

@Component({
    selector: 'app-covariance',
    templateUrl: './covariance.component.html',
    styleUrl: './covariance.component.scss',
    standalone: false
})
export class CovarianceComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;
  isDtInit:boolean = false
  dataTable: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList$: Observable<any>;
  selectOpcvm:any;
  idOpcvm:any;
  opcvm$: any;
  Covariance: any;
  reportList: any[] = [];
  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    private cr: ChangeDetectorRef,
    private reportingsService: ReportingsService,
    private opcvmService: OpcvmService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      denominationOpcvm: [null, Validators.required],
      dateDebut: [null, Validators.required],
      dateFin: [null,Validators.required],
      covariance: [null]
    });
    this.afficherOpcvm()
    this.dtOptions = {...this.reportingsService.dtOptions};
    console.log("INIT === ", this.form.value);
    // this.loadData();
  }
  valider(){
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
    let $  = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      // columnDefs: [{visible: false, targets: 5}],
      order: [],
      drawCallback: function (settings:any) {
        let api = this.api();
        /*let rows = api.rows({page:'current'} ).nodes();
        console.log("ROWS === ", settings);
        let last: any = null;
        api.column(5, {page:'current'} ).data().each(function (group: any, i: any) {
          console.log(group[5], i);
          console.log(last, group[5], i);
          if (last !== group[5]) {
            $(rows).eq(i).before(
              '<tr style="background-color:#49bbf1" class="group"><th colspan="9">'+group[5]+'</th></tr>'
            );
            last = group[5];
          }
        });*/
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
          title: "DATE .", data: 'dateFermeture', render: function (data: any, type: any, row: any) {
            let daterecup:string[];
            let mois:number;
            let libelleMois:string;
            daterecup=row.dateFermeture;
            mois=Number(daterecup[1]);
            libelleMois=daterecup[1]
            if(mois<10)
              libelleMois="0"+daterecup[1];
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
          title: "NAV BanchMark", data: 'nav', render: function (data: any, type: any, row: any) {
            return row.nav;
          }
        },
        {
          title: "Performance du portefeuille", data: 'performancePortefeuille', render: function (data: any, type: any, row: any) {
            return row.performancePortefeuille;
          }
        },
        {
          title: "Performance du BenchMark", data: 'performanceBenchMark', render: function (data: any, type: any, row: any) {
            return row.performanceBenchMark;
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
    datatable.columns([0,1,4]).visible( true);

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
    this.selectOpcvm=document.getElementById('ComboOpcvmRatioSharp')
    this.idOpcvm=this.selectOpcvm.options[this.selectOpcvm.selectedIndex].value;
    let dateDebut: any;
    let dateFin: any;
    if (this.form.controls.dateDebut.value) {
      dateDebut = new Date(
        this.form.controls.dateDebut.value.year,
        this.form.controls.dateDebut.value.month - 1,
        this.form.controls.dateDebut.value.day + 1);
    }
    if (this.form.controls.dateFin.value) {
      dateFin = new Date(
        this.form.controls.dateFin.value.year,
        this.form.controls.dateFin.value.month - 1,
        this.form.controls.dateFin.value.day + 1);
    }
    let dates = {startDate: dateDebut, endDate: dateFin};
    console.log("opcvm=",this.idOpcvm)
    console.log("dates=",dates)
    this.reportingsService.covariance(this.idOpcvm,
      dates)
      .pipe(first())
      .subscribe(data => {
        console.log(data)
        this.Covariance=data
        if(this.Covariance.length!==0)
        {
          console.log("Covariance",this.Covariance[0].Covariance)
          this.form.patchValue({covariance:this.Covariance[0].covariance})
        }
        this.dataTable = this.initDatatable("datatable_Covariance");
        this.dataTable.clear().rows.add(data).draw();
      });
    // this.subscriptions.push(sb);
  }
  afficherOpcvm(){
    this.opcvmService.afficherTous().subscribe(
      (data)=>{
        this.opcvm$=data.data;
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

