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
import { ExerciceService } from '../../../services/exercice.service';
import * as XLSX from "xlsx";
@Component({
  selector: 'app-avistransfertpart',
  standalone: false,
  templateUrl: './avistransfertpart.html',
  styleUrl: './avistransfertpart.scss'
})
export class Avistransfertpart implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
  idOperationTab:any[]
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
   public journalSettings = {};
  actionnaireSelectionne: Personne[];  
  exercice$: any;
  exercice: any;
  journal: any;
  codeJournal:any;
  actionnaire:any;
  operationTransfert$:any;

  allData:any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public journalService: JournalService,
    private libService: LibrairiesService,
    private exerciceService: ExerciceService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

   
   
    
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
      dateFin: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      dateDebut: [
       new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate()), Validators.required
      ],
    });
    this.idOperationTab=[]
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
        title: 'ID', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation
        },
      },
      {
        title: 'DATE OPERATION', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'DEMANDEUR', data: 'demandeur', render: function (data, type, row) {
          return row.demandeur;
        },
      },
      {
        title: 'QTE INITIALE', data: 'qteInitialeD', render: function (data, type, row) {
          return row.qteInitialeD;
        },
      },
      {
        title: 'CUMP', data: 'cumpEntre', render: function (data, type, row) {
          return row.cumpEntre;
        },
      },
      {
        title: 'BENEFICIAIRE', data: 'beneficiaire', render: function (data, type, row) {
          return row.beneficiaire;
        },
      },
      {
        title: 'QTE INITIALE', data: 'qteInitialeB', render: function (data, type, row) {
          return row.qteInitialeB;
        },
      },
      {
        title: 'QTE TRANSFERT', data: 'qteTransfert', render: function (data, type, row) {
          return row.qteTransfert;
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
            dateOuverture: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFermeture: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.operationTransfertPart(param)
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
  onTableDataChange(event: any) {
    this.page = event;
    // this.afficherActionnaire();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // this.afficherActionnaire();
  }
  getIdOperation(isSelected, idOPeration){
    console.log(isSelected, idOPeration)

    if(isSelected==true) {
      let index=this.idOperationTab.indexOf(idOPeration)
      if(index===-1)
        this.idOperationTab.push(idOPeration)
    }
    else
    {
      let index=this.idOperationTab.indexOf(idOPeration)
      if(index!==-1)
        this.idOperationTab.splice(index,1)
    }
    console.log(this.idOperationTab)
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
        title: 'ID', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation
        },
      },
      {
        title: 'DATE OPERATION', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'DEMANDEUR', data: 'demandeur', render: function (data, type, row) {
          return row.demandeur;
        },
      },
      {
        title: 'QTE INITIALE', data: 'qteInitialeD', render: function (data, type, row) {
          return row.qteInitialeD;
        },
      },
      {
        title: 'CUMP', data: 'cumpEntre', render: function (data, type, row) {
          return row.cumpEntre;
        },
      },
      {
        title: 'BENEFICIAIRE', data: 'beneficiaire', render: function (data, type, row) {
          return row.beneficiaire;
        },
      },
      {
        title: 'QTE INITIALE', data: 'qteInitialeB', render: function (data, type, row) {
          return row.qteInitialeB;
        },
      },
      {
        title: 'QTE TRANSFERT', data: 'qteTransfert', render: function (data, type, row) {
          return row.qteTransfert;
        },
      },

    ];
    // 1️⃣ Définir les entêtes
    const headers = ['ID','DATE OPERATION','DEMANDEUR','QTE INITIALE','CUMP',
      'BENEFICIAIRE','QTE INITIALE B',
      'QTE TRANSFERT'
    ];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
      param = {
        ...param,
        dateOuverture: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
        dateFermeture: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
      }
    this.libService.avistransfertpartListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'ID': item.idOperation,
          'DATE OPERATION':moment(item.dateOperation).format('DD/MM/YYYY'),
          'DEMANDEUR': item.demandeur,
          'QTE INITIALE': item.qteInitialeD,
          'CUMP': item.cumpEntre,
          'BENEFICIAIRE': item.beneficiaire,
          'QTE INITIALE B': item.qteInitialeB,
          'QTE TRANSFERT': item.qteTransfert,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'operation_transfert_part.xlsx');
        this.export=false
      }
    )
    // 2️⃣ Mapper les données avec les entêtes

  }

  actualiser() {
    let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
        
        };
       
          param = {
            ...param,
            dateOuverture: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFermeture: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.operationTransfertPart(param)
            .subscribe(resp => {
              console.log("Retour releve === ", resp.data);
              this.operationTransfert$=resp.data
            });
          this.subscriptions.push(sb);
        
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
      idOp:this.idOperationTab,
      dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    const sb = this.libService.avistransfertpartEtat(param)
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
        a.download = 'avis_transfert_part.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
