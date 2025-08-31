import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {LocalService} from "../../../../services/local.service";
import {LibrairiesService} from "../../../../services/librairies.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {saveAs} from "file-saver";

@Component({
    selector: 'app-portefeuille',
    templateUrl: './portefeuille.component.html',
    styleUrl: './portefeuille.component.scss',
    standalone: false
})
export class PortefeuilleComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  allData:any;
  [key: string]: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    private libService: LibrairiesService,
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
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      // idSeance: [this.currentSeance?.idSeanceOpcvm?.idSeance],
      // idActionnaire: [null],
      dateEstimation: [
        new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()), Validators.required
      ]
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
    this.actualiser();
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
      {
        title: 'RUBRIQUE', data: 'typeRubrique', render: function (data, type, row) {
          return row.typeRubrique;
        },
      },
      {
        title: 'CLASSE', data: 'classeTitre', render: function (data, type, row) {
          return row.classeTitre;
        },
      },
      {
        title: 'SYMBOLE', data: 'symboleTitre', render: function (data, type, row) {
          return row.symboleTitre;
        },
      },
      {
        title: 'COUPON COUR.', data: 'couponCouru', render: function (data, type, row) {
          return row.couponCouru;
        },
      },
      {
        title: 'QTE A REC.', data: 'qteARecevoir', render: function (data, type, row) {
          return row.qteARecevoir;
        },
      },
      {
        title: 'QTE  A LIV.', data: 'qteALivrer', render: function (data, type, row) {
          return row.qteALivrer;
        },
      },
      {
        title: 'QTE', data: 'soldeQteReel', render: function (data, type, row) {
          return row.soldeQteReel;
        },
      },
      {
        title: 'CUMP', data: 'cAMreel', render: function (data, type, row) {
          return row.caMreel;
        },
      },
      {
        title: 'P.REVIENS', data: 'prixDeRevientReel', render: function (data, type, row) {
          return row.prixDeRevientReel;
        },
      },
      {
        title: 'Cours', data: 'cours', render: function (data, type, row) {
          return row.cours;
        },
      },
      {
        title: 'VALORISATION', data: 'valorisationReelle', render: function (data, type, row) {
          return row.valorisationReelle;
        },
      },
      {
        title: 'Espece', data: 'soldeEspReel', render: function (data, type, row) {
          return row.soldeEspReel;
        },
      },
    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            dateOperation: new Date(param.dateEstimation.year, param.dateEstimation.month-1, param.dateEstimation.day+1),
          };
          console.log(param);
          const sb = this.libService.portefeuille(param)
            .subscribe(resp => {
               console.log("Retour portefeuille === ", resp.data);
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
    // 1️⃣ Définir les entêtes
    const headers = ['RUBRIQUE','CLASSE','SYMBOLE','COUPON COUR.','QTE A REC.','QTE  A LIV.','QTE','CUMP','P.REVIENS', 'Cours', 'VALORISATION', 'Espece'];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };

      param = {
        ...param,
        dateOperation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      }
    this.libService.portefeuilleListe(param).subscribe(
      (data)=>{
        this.allData=data.data;
        const exportData = this.allData.map(item => ({
          'RUBRIQUE': item.typeRubrique,
          'CLASSE': item.classeTitre,
          'COUPON COUR.': item.couponCouru,
          'SYMBOLE': item.symboleTitre,
          'QTE A REC.': item.qteARecevoir,
          'QTE  A LIV.': item.qteALivrer,
          'QTE': item.soldeQteReel,
          'CUMP': item.caMreel,
          'P.REVIENS': item.prixDeRevientReel,
          'Cours': item.cours,
          'VALORISATION': item.valorisationReelle,
          'Espece': item.soldeEspReel,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'portefeuille.xlsx');
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
    const param = {
      ...formValue,
      idOpcvm: this.currentOpcvm?.idOpcvm,
      dateOperation: new Date(
        formValue.dateEstimation.year,
        formValue.dateEstimation.month-1,
        formValue.dateEstimation.day+1
      ),
    };
    const sb = this.libService.portefeuilleetat(param)
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
      .subscribe((response: any) => {
        console.log("Ici le retour attendu !!", response);
        /*const linkSource =
          'data:application/octet-stream;base64,' + response.data;
        const downloadLink = document.createElement('a');
        const fileName = 'listVerifDepot.pdf';

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();*/
      });
    this.subscriptions.push(sb);
  }
}
