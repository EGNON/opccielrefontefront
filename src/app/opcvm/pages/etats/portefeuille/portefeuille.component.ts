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
import * as XLSX from 'xlsx-js-style';
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
    this.libService.portefeuilleListe(param).subscribe({
         next: (data) => {
        this.allData = data.data;
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

        // // 3️⃣ Convertir en feuille Excel
        // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // // 4️⃣ Créer le classeur
        // const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // // 5️⃣ Exporter
        // const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        // saveAs(blob, 'portefeuille.xlsx');
        // this.export=false
         // 1. Créer la feuille Excel
                const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
                  exportData,
                  { header: headers }
                );
        
                // 2. Définir la largeur des colonnes
                ws['!cols'] = [
                  { wch: 16 }, // N°Compte
                  { wch: 45 }, // LIBELLE
                  { wch: 22 }, // DEB. PERIODE (D).
                  { wch: 22 }, // DEB. PERIODE (C)
                  { wch: 22 }, // MVT PERIODE (D)
                  { wch: 22 }, // MVT PERIODE (C)
                  { wch: 22 }, // FIN PERIODE (D)
                  { wch: 22 },  // FIN PERIODE (C)
                  { wch: 22 },  // FIN PERIODE (C)
                  { wch: 22 },  // FIN PERIODE (C)
                  { wch: 22 },  // FIN PERIODE (C)
                  { wch: 22 }  // FIN PERIODE (C)
                ];
        
                // 3. Définir les bordures et les styles
                const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
        
                for (let row = range.s.r; row <= range.e.r; row++) {
                  for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({
                      r: row,
                      c: col
                    });
        
                    const cell = ws[cellAddress];
        
                    if (!cell) continue;
        
                    if (row === 0) {
                      // En-tête
                      cell.s = {
                        font: {
                          name: 'Verdana',
                          sz: 10,
                          bold: true,
                          color: { rgb: '2B2C3C' }
                        },
                        fill: {
                          patternType: 'solid',
                          fgColor: { rgb: 'D9EAF7' }
                        },
                        alignment: {
                          horizontal: 'center',
                          vertical: 'center',
                          wrapText: true
                        },
                        border: {
                          top: {
                            style: 'thin',
                            color: { rgb: 'A6B9C9' }
                          },
                          bottom: {
                            style: 'thin',
                            color: { rgb: 'A6B9C9' }
                          },
                          left: {
                            style: 'thin',
                            color: { rgb: 'D0DCE5' }
                          },
                          right: {
                            style: 'thin',
                            color: { rgb: 'D0DCE5' }
                          }
                        }
                      };
                    } else {
                      // Lignes de données : alternance blanc et bleu clair
                      const couleurFond = row % 2 === 0
                        ? 'E5F5FF'
                        : 'FFFFFF';
        
                      cell.s = {
                        font: {
                          name: 'Verdana',
                          sz: 10,
                          color: { rgb: '000000' }
                        },
                        fill: {
                          patternType: 'solid',
                          fgColor: { rgb: couleurFond }
                        },
                        alignment: {
                          horizontal: col === 1 ? 'left' : 'right',
                          vertical: 'center'
                        },
                        border: {
                          bottom: {
                            style: 'thin',
                            color: { rgb: 'DCEAF2' }
                          },
                          left: {
                            style: 'thin',
                            color: { rgb: 'E1E8ED' }
                          },
                          right: {
                            style: 'thin',
                            color: { rgb: 'E1E8ED' }
                          }
                        }
                      };
        
                      // Format numérique pour les colonnes de montants
                      if (col >= 2) {
                        cell.z = '#,##0.00';
                      }
                    }
                  }
                }
        
                // 4. Hauteur des lignes
                ws['!rows'] = [
                  { hpt: 28 },
                  ...Array.from(
                    { length: Math.max(0, range.e.r) },
                    () => ({ hpt: 20 })
                  )
                ];
        
                // 5. Créer le classeur Excel
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
        
                XLSX.utils.book_append_sheet(wb, ws, 'Portefeuille');
        
                // 6. Générer le fichier Excel
                const excelBuffer = XLSX.write(wb, {
                  bookType: 'xlsx',
                  type: 'array'
                });
        
                const blob = new Blob(
                  [excelBuffer],
                  { type: 'application/octet-stream' }
                );
        
                saveAs(blob, 'portefeuille.xlsx');
        
                this.export = false;
              },
              error: (err) => {
                console.error('Erreur lors de l’export de la balance :', err);
                this.export = false;
              }
          });
      
    
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
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portefeuille.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
