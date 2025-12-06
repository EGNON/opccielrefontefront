import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config, Api } from 'datatables.net';
import saveAs from 'file-saver';
import moment from 'moment';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { JournalService } from '../../../../core/services/journal.service';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import * as XLSX from "xlsx";
import { TypeoperationService } from '../../../../core/services/typeoperation.service';
@Component({
  selector: 'app-point-investissement',
  standalone: false,
  templateUrl: './point-investissement.html',
  styleUrl: './point-investissement.scss'
})
export class PointInvestissement implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;
  dateDebut:any;
  dateFin:any;
  annee:number;
  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
   public journalSettings = {};
  actionnaireSelectionne: Personne[];  
  typeOperation$: any;
  typeOperation: any;
  journal: any;
  codeJournal:any;
  actionnaire:any;

  allData:any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public journalService: JournalService,
    private libService: LibrairiesService,
    private typeOperationService: TypeoperationService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

    this.affichertypeOperation();
   
    
  }
 
affichertypeOperation(){
    this.typeOperationService.afficherTous(
    ).subscribe(
      (data)=>{
        this.typeOperation$=data.data;
        this.typeOperation=data.data;
       console.log("typeOperation=",data)
      }
    )
  }
 
  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    const dateFin = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      typeOperation:[null],
      dateFin: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      dateDebut: [
       new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate()), Validators.required
      ],
    });
    this.dtOptions = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
      pagingType: "simple_numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm d-none'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm d-none',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
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
    };
    //this.actualiser();
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
     
      {
        title: 'NATURE OPERATION', data: 'codeNatureOperation', render: function (data, type, row) {
          return row.codeNatureOperation
        },
      },
      {
        title: 'DATE OPERATION', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateEstimation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'LIBELLE OPERATION', data: 'libelleOperation', render: function (data, type, row) {
          return row.libelleOperation;
        },
      },
      {
        title: 'QTE. LIMITE', data: 'quantiteLimite', render: function (data, type, row) {
          return row.quantiteLimite;
        },
      },
      {
        title: 'COURS LIMITE', data: 'coursLimite', render: function (data, type, row) {
          return row.coursLimite;
        },
      },
      {
        title: 'MT. BRUT', data: 'montantBrut', render: function (data, type, row) {
          return row.montantBrut;
        },
      },
      {
        title: 'COMMISSION PLACE', data: 'commissionPlace', render: function (data, type, row) {
          return row.commissionPlace;
        },
      },
      {
        title: 'COMMISSION DEPOSITAIRE', data: 'commissionDepositaire', render: function (data, type, row) {
          return row.commissionDepositaire;
        },
      },
      {
        title: 'COMMISSION SGI', data: 'commissionSGI', render: function (data, type, row) {
          return row.commissionSGI;
        },
      },
      {
        title: 'TAF', data: 'taf', render: function (data, type, row) {
          return row.taf;
        },
      },
      {
        title: 'IRVM', data: 'irvm', render: function (data, type, row) {
          return row.irvm;
        },
      },
      {
        title: '(+-Value)', data: 'plusOuMoinsValue', render: function (data, type, row) {
          return row.plusOuMoinsValue;
        },
      },
      {
        title: 'MONTANT', data: 'montant', render: function (data, type, row) {
          return row.montant;
        },
      },

    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            typeOp:param.typeOperation,
            dateDeb: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.pointinvestissement(param)
            .subscribe(resp => {
              console.log("Retour releve === ", resp.data);
              callback(resp.data);
            });
          this.subscriptions.push(sb);
        }
        else {
          callback({
            draw: dataTablesParameters.draw,
            recordsTotal: 1,
            recordsFiltered: 1,
            data: []
          });
        }
      },
      columns: columns,
      // drawCallback: function(settings) {
      //   // @ts-ignore
      //   let api = this.api();
      //   let rows = api.rows({ page: 'current' }).nodes();
      //   let last = null;

      //   api.column(0, { page: 'current' }).data().each(function(group, i) {
      //     if (last !== group) {
      //       $(rows).eq(i).before(
      //         `<tr class="group"><td colspan="${api.columns().count()}"><b>${group}</b></td></tr>`
      //       );
      //       last = group;
      //     }
      //   });
      // },
      createdRow: function (row, data: any, dataIndex) {},
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
  }

  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
  }
  exportExcel() {
    this.export=true
     let columns: any[] = [
     
      {
        title: 'NATURE OPERATION', data: 'codeNatureOperation', render: function (data, type, row) {
          return row.codeNatureOperation
        },
      },
      {
        title: 'DATE OPERATION', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateEstimation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'LIBELLE OPERATION', data: 'libelleOperation', render: function (data, type, row) {
          return row.libelleOperation;
        },
      },
      {
        title: 'QTE. LIMITE', data: 'quantiteLimite', render: function (data, type, row) {
          return row.quantiteLimite;
        },
      },
      {
        title: 'COURS LIMITE', data: 'coursLimite', render: function (data, type, row) {
          return row.coursLimite;
        },
      },
      {
        title: 'MT. BRUT', data: 'montantBrut', render: function (data, type, row) {
          return row.montantBrut;
        },
      },
      {
        title: 'COMMISSION PLACE', data: 'commissionPlace', render: function (data, type, row) {
          return row.commissionPlace;
        },
      },
      {
        title: 'COMMISSION DEPOSITAIRE', data: 'commissionDepositaire', render: function (data, type, row) {
          return row.commissionDepositaire;
        },
      },
      {
        title: 'COMMISSION SGI', data: 'commissionSGI', render: function (data, type, row) {
          return row.commissionSGI;
        },
      },
      {
        title: 'TAF', data: 'tAF', render: function (data, type, row) {
          return row.tAF;
        },
      },
      {
        title: 'IRVM', data: 'iRVM', render: function (data, type, row) {
          return row.iRVM;
        },
      },
      {
        title: '(+-Value)', data: 'plusOuMoinsValue', render: function (data, type, row) {
          return row.plusOuMoinsValue;
        },
      },
      {
        title: 'MONTANT', data: 'montant', render: function (data, type, row) {
          return row.montant;
        },
      },

    ];
    // 1️⃣ Définir les entêtes
    const headers = ['NATURE OPERATION','DATE OPERATION','LIBELLE OPERATION','QTE. LIMITE',
      'COURS LIMITE','MT. BRUT','COMMISSION PLACE',
      'COMMISSION DEPOSITAIRE','COMMISSION SGI','TAF','IRVM','(+-Value)','MONTANT'
    ];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
      param = {
        ...param,
        typeOp:param.typeOperation,
        dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
        dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
      }
    this.libService.pointinvestissementListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'NATURE OPERATION': item.codeNatureOperation,
          'DATE OPERATION':moment(item.dateOperation).format('DD/MM/YYYY'),
          'LIBELLE OPERATION': item.libelleOperation,
          'QTE. LIMITE': item.quantiteLimite,
          'COURS LIMITE': item.coursLimite,
          'MT. BRUT': item.montantBrut,
          'COMMISSION PLACE': item.commissionPlace,
          'COMMISSION DEPOSITAIRE': item.commissionDepositaire,
          'COMMISSION SGI': item.commissionSGI,
          'TAF': item.taf,
          'IRVM': item.irvm,
          '(+-Value)': item.plusOuMoinsValue,
          'MONTANT': item.montant,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'point_investissement.xlsx');
        this.export=false
      }
    )
    // 2️⃣ Mapper les données avec les entêtes

  }

  actualiser() {
    this.afficherListe("l");
  }

  telecharger() {
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      typeOp:param.typeOperation,
      dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    console.log(param)
    //.subscribe
    const sb = this.libService.pointinvestissementEtat(param)
      .pipe(
        catchError((err) => {
          this.downloading = false;
          return of(err.message);
        }),
        finalize(() => {
          this.downloading = false;
          this.downloaded = false;
        })
      )
     .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'point_investissement.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
