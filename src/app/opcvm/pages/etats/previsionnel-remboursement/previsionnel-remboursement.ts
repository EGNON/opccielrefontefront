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
import { TypeoperationService } from '../../../../core/services/typeoperation.service';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-previsionnel-remboursement',
  standalone: false,
  templateUrl: './previsionnel-remboursement.html',
  styleUrl: './previsionnel-remboursement.scss'
})
export class PrevisionnelRemboursement implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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

    //this.affichertypeOperation();
   
    
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
      echue:[false],
      traiter:[false],
      detache:[false],
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
        title: 'SYMBOL', data: 'symboleTitre', render: function (data, type, row) {
          return row.symbolTitre
        },
      },
      {
        title: 'DESIGNATION TITRE', data: 'designationTitre', render: function (data, type, row) {
          return row.designationTitre
        },
      },
      {
        title: 'DATE ECHEANCE', data: 'dateEcheance', render: function (data, type, row) {
          return moment(row.dateEcheance).format("DD/MM/YYYY");
        },
      },
      {
        title: 'ECHEANCE N°', data: 'numEcheance', render: function (data, type, row) {
          return row.numEcheance;
        },
      },
      {
        title: 'QUANTITE', data: 'soldeQte', render: function (data, type, row) {
          return row.quantite;
        },
      },
      {
        title: 'INTERET', data: 'interet', render: function (data, type, row) {
          return row.interet;
        },
      },
      {
        title: 'AMORTISSEMENT', data: 'amortissement', render: function (data, type, row) {
          return row.amortissement;
        },
      },
      {
        title: 'TYPE', data: 'modeAmortissement', render: function (data, type, row) {
          return row.modeAmortissement;
        },
      },
      {
        title: 'TOTAL', data: 'total', render: function (data, type, row) {
          return row.total;
        },
      },
      {
        title: 'ESPECE', data: 'solde', render: function (data, type, row) {
          return row.solde;
        },
      },
      {
        title: 'CLASSE', data: 'classeTitre', render: function (data, type, row) {
          return row.classeTitre;
        },
      },
      {
        title: 'ECHUE?', data: 'echue', render: function (data, type, row) {
          return row.echue===true?"OUI":"NON";
        },
      },
      {
        title: 'DETACHE?', data: 'detache', render: function (data, type, row) {
          return row.detache===true?"OUI":"NON";
        },
      },
      {
        title: 'TRAITER?', data: 'traiter', render: function (data, type, row) {
          return row.traiter===true?"OUI":"NON";
        },
      },
      {
        title: 'LES ECHEANCES DE', data: 'moisAnnee', render: function (data, type, row) {
          return row.moisAnnee;
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
            dateDeb: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.previsionnelremboursements(param)
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
        title: 'SYMBOL', data: 'symboleTitre', render: function (data, type, row) {
          return row.symboleTitre
        },
      },
      {
        title: 'DESIGNATION TITRE', data: 'designationTitre', render: function (data, type, row) {
          return row.designationTitre
        },
      },
      {
        title: 'DATE ECHEANCE', data: 'dateEcheance', render: function (data, type, row) {
          return moment(row.dateEcheance).format("DD/MM/YYYY");
        },
      },
      {
        title: 'ECHEANCE N°', data: 'numEcheance', render: function (data, type, row) {
          return row.numEcheance;
        },
      },
      {
        title: 'QUANTITE', data: 'soldeQte', render: function (data, type, row) {
          return row.quantite;
        },
      },
      {
        title: 'INTERET', data: 'interet', render: function (data, type, row) {
          return row.interet;
        },
      },
      {
        title: 'AMORTISSEMENT', data: 'amortissement', render: function (data, type, row) {
          return row.amortissement;
        },
      },
      {
        title: 'TYPE', data: 'modeAmortissement', render: function (data, type, row) {
          return row.modeAmortissement;
        },
      },
      {
        title: 'TOTAL', data: 'total', render: function (data, type, row) {
          return row.total;
        },
      },
      {
        title: 'ESPECE', data: 'solde', render: function (data, type, row) {
          return row.solde;
        },
      },
      {
        title: 'CLASSE', data: 'classeTitre', render: function (data, type, row) {
          return row.classeTitre;
        },
      },
      {
        title: 'ECHUE?', data: 'echue', render: function (data, type, row) {
          return row.echue===true?"OUI":"NON";
        },
      },
      {
        title: 'DETACHE?', data: 'detache', render: function (data, type, row) {
          return row.detache===true?"OUI":"NON";
        },
      },
      {
        title: 'TRAITER?', data: 'traiter', render: function (data, type, row) {
          return row.traiter===true?"OUI":"NON";
        },
      },
      {
        title: 'LES ECHEANCES DE', data: 'moisAnnee', render: function (data, type, row) {
          return row.moisAnnee;
        },
      },

    ];
    // 1️⃣ Définir les entêtes
    const headers = ['SYMBOL','DESIGNATION TITRE','DATE ECHEANCE','ECHEANCE N°',
      'QUANTITE','INTERET','AMORTISSEMENT',
      'TYPE','TOTAL','ESPECE','CLASSE','ECHUE?','DETACHE?','TRAITER?','LES ECHEANCES DE'
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
    this.libService.previsionnelremboursementsListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'SYMBOL': item.symbolTitre,
          'DESIGNATION TITRE':item.designationTitre,
          'DATE ECHEANCE':moment(item.dateEcheance).format('DD/MM/YYYY'),
          'ECHEANCE N°': item.numEcheance,
          'QUANTITE': item.quantite,
          'INTERET': item.interet,
          'AMORTISSEMENT': item.amortissement,
          'TYPE': item.modeAmortissement,
          'TOTAL': item.total,
          'ESPECE': item.solde,
          'CLASSE': item.classeTitre,
          'ECHUE?': item.echue===true?"OUI":"NON",
          'DETACHE?': item.detache===true?"OUI":"NON",
          'TRAITER?':item.traiter===true?"OUI":"NON",
          'LES ECHEANCES DE':item.moisAnnee,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'previsionnel_remboursement.xlsx');
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
      dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    console.log(param)
    //.subscribe
    const sb = this.libService.previsionnelremboursementsEtat(param)
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
        a.download = 'previsionnel_remboursement.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
