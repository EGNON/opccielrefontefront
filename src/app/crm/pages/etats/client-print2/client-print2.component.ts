import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Personne } from '../../../models/personne/personne.model';
import { PersonneMoraleService } from '../../../services/personne/personne.morale.service';
import { PersonnePhysiqueService } from '../../../services/personne/personne.physique.service';
import $ from "jquery";
import moment from "moment/moment";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-client-print2',
  templateUrl: './client-print2.component.html',
  styleUrl: './client-print2.component.scss'
})
export class ClientPrint2Component implements OnInit, OnDestroy, AfterViewInit{
  baseRoute: string = "";
  qualite?: string | null;
  entity: any;
  dateJour:Date;
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;
  dtOptions: any = {};
  isDtInit:boolean = false
  dataTable: any;
  dataTable_Morale: any;
  dtTrigger: Subject<any> = new Subject<any>();
  newButtonTitle: string = "Nouveau";
  personnes$: any;
  title: string;
  prospect: string;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  afficherPersonnePhysique:boolean;

  selectProspect:any;
  constructor(
    private cr: ChangeDetectorRef,
    public personnePhysiqueService: PersonnePhysiqueService,
    public personneMoraleService: PersonneMoraleService,
    private route: ActivatedRoute) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.prospect="Personne physique";
    this.selectProspect = document.getElementById("ComboClient");
    this.dateJour=new Date();
    this.dtOptions = {...this.personnePhysiqueService.dtOptions};
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
    /*let columns: any[];
    let lib = this.prospect;
    switch (lib) {
      case 'Personne physique':
        columns = [
          {
            title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
              const numeroCpteDeposit = row.numeroCpteDeposit;
              return numeroCpteDeposit || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Civilité', data: 'civilite', render: function (data:any, type:any, full:any) {
              return full.civilite || '';
            }
          },
          {
            title: 'Dénomination', data: 'nom', render: function (data:any, type:any, full:any) {
              return full.denomination || '';
            }
          },
          {
            title: 'Mobile 1', data: 'mobile1', render: function (data: any, type: any, row: any) {
              const roleName = row.mobile1;
              return roleName || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Nationalité', data: 'paysNationalite', render: function (data: any, type: any, row: any) {
              const pays = row.paysNationalite;
              if(!pays)
                return '';

              return pays.libelleFr;
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Mode d\'établissement', data: 'modeEtablissementDto', render: function (data:any, type:any, full:any) {
              const mode = full.modeEtablissementDto;
              if(!mode)
                return '';

              return mode.libelle;
            }
          },
        ];
        break;
      case 'Personne morale':
        columns = [
          {
            title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
              const numeroCpteDeposit = row.numeroCpteDeposit;
              return numeroCpteDeposit || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'SIGLE', data: 'sigle', render: function (data: any, type: any, row: any) {
              return row.sigle || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'RAISON SOCIALE', data: 'denomination', render: function (data: any, type: any, row: any) {
              return row.denomination || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'SITE WEB', data: 'siteWeb', render: function (data: any, type: any, row: any) {
              return row.siteWeb || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          }
        ];
        break;
    }*/
    let $ = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      // columnDefs: [{visible: false, targets: 5}],
      order: [],
      drawCallback: function (settings: any) {
        let api = this.api();
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
          title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
            const numeroCpteDeposit = row.numeroCpteDeposit;
            return numeroCpteDeposit || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Civilité', data: 'civilite', render: function (data:any, type:any, full:any) {
            return full.civilite || '';
          }
        },
        {
          title: 'Dénomination', data: 'nom', render: function (data:any, type:any, full:any) {
            return full.denomination || '';
          }
        },
        {
          title: 'Mobile 1', data: 'mobile1', render: function (data: any, type: any, row: any) {
            const roleName = row.mobile1;
            return roleName || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Nationalité', data: 'paysNationalite', render: function (data: any, type: any, row: any) {
            const pays = row.paysNationalite;
            if(!pays)
              return '';

            return pays.libelleFr;
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Mode d\'établissement', data: 'modeEtablissementDto', render: function (data:any, type:any, full:any) {
            const mode = full.modeEtablissementDto;
            if(!mode)
              return '';

            return mode.libelle;
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
    datatable.columns([0, 1, 4]).visible(true);

    return datatable;
  }
  initDatatable_Morale(tableId: any) {
    /*let columns: any[];
    let lib = this.prospect;
    switch (lib) {
      case 'Personne physique':
        columns = [
          {
            title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
              const numeroCpteDeposit = row.numeroCpteDeposit;
              return numeroCpteDeposit || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Civilité', data: 'civilite', render: function (data:any, type:any, full:any) {
              return full.civilite || '';
            }
          },
          {
            title: 'Dénomination', data: 'nom', render: function (data:any, type:any, full:any) {
              return full.denomination || '';
            }
          },
          {
            title: 'Mobile 1', data: 'mobile1', render: function (data: any, type: any, row: any) {
              const roleName = row.mobile1;
              return roleName || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Nationalité', data: 'paysNationalite', render: function (data: any, type: any, row: any) {
              const pays = row.paysNationalite;
              if(!pays)
                return '';

              return pays.libelleFr;
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Mode d\'établissement', data: 'modeEtablissementDto', render: function (data:any, type:any, full:any) {
              const mode = full.modeEtablissementDto;
              if(!mode)
                return '';

              return mode.libelle;
            }
          },
        ];
        break;
      case 'Personne morale':
        columns = [
          {
            title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
              const numeroCpteDeposit = row.numeroCpteDeposit;
              return numeroCpteDeposit || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'SIGLE', data: 'sigle', render: function (data: any, type: any, row: any) {
              return row.sigle || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'RAISON SOCIALE', data: 'denomination', render: function (data: any, type: any, row: any) {
              return row.denomination || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'SITE WEB', data: 'siteWeb', render: function (data: any, type: any, row: any) {
              return row.siteWeb || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          }
        ];
        break;
    }*/
    let $ = require('jquery');
    const datatable = $(`#${tableId}`).DataTable({
      dom: 'Bfrtip',
      // columnDefs: [{visible: false, targets: 5}],
      order: [],
      drawCallback: function (settings: any) {
        let api = this.api();
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
          title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
            const numeroCpteDeposit = row.numeroCpteDeposit;
            return numeroCpteDeposit || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'SIGLE', data: 'sigle', render: function (data: any, type: any, row: any) {
            return row.sigle || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'RAISON SOCIALE', data: 'denomination', render: function (data: any, type: any, row: any) {
            return row.denomination || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'SITE WEB', data: 'siteWeb', render: function (data: any, type: any, row: any) {
            return row.siteWeb || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
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
    datatable.columns([0, 1, 2]).visible(true);

    return datatable;
  }
    ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
      this.dtTrigger.unsubscribe();


  }
  afficherClient(){
    this.prospect=this.selectProspect.options[this.selectProspect.selectedIndex].text;
    if(this.prospect=="Personne physique"){
      //this.dtOptions = {...this.personnePhysiqueService.dtOptions};
      this.qualite="actionnaires".toUpperCase();
      /*this.personnes$ = this.route.paramMap
        .pipe(
          switchMap((qualite) => this.personnePhysiqueService.afficherPersonneSelonQualite(this.qualite))
        );*/
      this.personnePhysiqueService.afficherPersonneSelonQualite(this.qualite).pipe(first()).subscribe(
        (data)=>{
          console.log(data)
          this.dataTable = this.initDatatable("datatable_Client_Physique");
          this.dataTable.clear().rows.add(data).draw();
        }
      )
    }
    else
    {
      this.dtOptions = {...this.personneMoraleService.dtOptions};
      this.qualite="actionnaires".toUpperCase()
      this.personneMoraleService.afficherPersonneSelonQualite(this.qualite).pipe(first()).subscribe(
        (data)=>{
          this.dataTable_Morale = this.initDatatable_Morale("datatable_Client_Morale");
          this.dataTable_Morale.clear().rows.add(data).draw();
        }
      )
      /*this.personnes$ = this.route.paramMap
        .pipe(
          switchMap((qualite) => this.personneMoraleService.afficherPersonneSelonQualite(this.qualite))
        );*/
    }
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
