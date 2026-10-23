import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {finalize, Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {PaysService} from "../../../../crm/services/pays.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeletePaysModalComponent} from "../../pays/delete-pays-modal/delete-pays-modal.component";
import {DepotRachatService} from "../../../services/depotrachat.service";
import moment from "moment";
import {hebrewNumerals} from "@ng-bootstrap/ng-bootstrap/datepicker/hebrew/hebrew";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OperationService} from "../../../services/operation.service";
import {ExerciceService} from "../../../services/exercice.service";
import {ShareService} from "../../../services/share.service";
import * as XLSX from 'xlsx-js-style';
import {Config} from "datatables.net";

@Component({
    selector: 'app-depotsuperieuracinqmillions',
    templateUrl: './depotsuperieuracinqmillions.component.html',
    styleUrl: './depotsuperieuracinqmillions.component.scss',
    standalone: false
})
export class DepotsuperieuracinqmillionsComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  datatableConfig: Config = {};

  imprimer:boolean;
  download:boolean;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  depotRachat$:any;
  codeExercice:any;
  selectExercie:any;
  swalOptions: SweetAlertOptions = {};
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
  exercice$:any;
private clickListener: () => void;
private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public operationService:OperationService,
    public pageInfo:PageInfoService,
    private router: Router,
    public exerciceService:ExerciceService,
    public sharedService:ShareService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    // this.afficherDepot();
    this.afficherExercice()
    this.pageInfo.updateTitle("Liste des opérations effectuées par des personnes physiques et supérieure à 5 millions")
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
    this.clickListener();
  }
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}
exporterExcel(): void {
      const donneesExcel = this.depotRachat$.map(operation => ({
        'Date opération': operation.dateOperation
          ? new Date(operation.dateOperation).toLocaleDateString('fr-FR')
          : '',
  
        'Actionnaire': operation.denomination ?? '',
  
        'Montant déposé': operation.montantDepose ?? 0,
  
        'Type de FCP': operation.denominationOpcvm ?? '',
  
        'Total': operation.total ?? 0,
  
        // 'Date première souscription': operation.datePremiereSouscription
        //   ? new Date(operation.datePremiereSouscription).toLocaleDateString('fr-FR')
        //   : ''
      }));
  
      const feuille: XLSX.WorkSheet = XLSX.utils.json_to_sheet(donneesExcel);
  
      // Largeur des colonnes
      feuille['!cols'] = [
        { wch: 18 }, // Date opération
        { wch: 35 }, // Dénomination
        { wch: 20 }, // Montant déposé
        { wch: 30 }, // OPCVM
        { wch: 20 }, // Total
        // { wch: 25 }  // Date première souscription
      ];
  
      // Récupérer les dimensions de la feuille
      const plage = XLSX.utils.decode_range(feuille['!ref'] || 'A1');
  
      // Mise en forme de toutes les cellules
      for (let ligne = plage.s.r; ligne <= plage.e.r; ligne++) {
        for (let colonne = plage.s.c; colonne <= plage.e.c; colonne++) {
          const adresse = XLSX.utils.encode_cell({
            r: ligne,
            c: colonne
          });
  
          const cellule = feuille[adresse];
  
          if (!cellule) continue;
  
          if (ligne === 0) {
            // En-têtes
            cellule.s = {
              font: {
                name: 'Verdana',
                sz: 10,
                bold: true,
                color: { rgb: '2B2C3C' }
              },
              fill: {
                patternType: 'solid',
                fgColor: { rgb: 'FFFFFF' }
              },
              alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true
              },
              border: {
                bottom: {
                  style: 'thin',
                  color: { rgb: 'D5DDE5' }
                }
              }
            };
          } else {
            // Alternance blanc / bleu clair
            const couleurFond =
              ligne % 2 === 0 ? 'E5F5FF' : 'FFFFFF';
  
            cellule.s = {
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
                horizontal: colonne === 2 || colonne === 4
                  ? 'right'
                  : 'left',
                vertical: 'center'
              },
              border: {
                bottom: {
                  style: 'hair',
                  color: { rgb: 'DCEAF2' }
                }
              }
            };
  
            // Format des montants
            if (colonne === 2 || colonne === 4) {
              cellule.z = '#,##0.00';
            }
          }
        }
      }
  
      // Hauteur des lignes
      feuille['!rows'] = [
        { hpt: 24 },
        ...Array.from(
          { length: Math.max(0, plage.e.r) },
          () => ({ hpt: 19 })
        )
      ];
  
      // Créer le fichier Excel
      const classeur = XLSX.utils.book_new();
  
      XLSX.utils.book_append_sheet(
        classeur,
        feuille,
        'feuille1'
      );
  
      XLSX.writeFile(
        classeur,
        'Liste des opérations effectuées par des personnes physiques et supérieure à 5 millions.xlsx'
      );
    }
  clickMe(){
  //  this.sharedService.sendClickEventCinq();
    this.afficherDepot();
  }
  afficherExercice(){
    this.exerciceService.afficherTous().subscribe(
      (data)=>{
        this.exercice$=data;
      }
    )
  }
afficherDepot()
{
  this.selectExercie=document.getElementById('comboExerciceCinq')
  this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
  this.operationService.afficherOperationSupCinqMillions(this.codeExercice).subscribe(
    (data)=>{
      this.depotRachat$=data;
    }
  )
}
  onTableDataChange(event: any) {
    this.page = event;
    this.afficherDepot();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.afficherDepot();
  }
  // afficherDepot(){
  //   this.datatableConfig = {
  //     serverSide: true,
  //     ajax: (dataTablesParameters: any, callback) => {
  //       const sb = this.depotRachatService.afficherTous(dataTablesParameters)
  //         .subscribe(resp => {
  //           callback(resp);
  //         });
  //       this.subscriptions.push(sb);
  //     },
  //     columns: [
  //       {
  //         title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
  //           return moment(row.dateOperation).format('DD/MM/YYYY');
  //         },
  //       },
  //       // {
  //       //   title: 'Type', data: 'typeOperation', render: function (data, type, row) {
  //       //     return row?.typeOperation;
  //       //   },
  //       // },
  //       {
  //         title: 'Actionnaire', data: 'actionnaire', render: function (data, type, row) {
  //           return row.nomPersonnePhysique+' '+row.prenomPersonnePhysique;
  //         },
  //       },
  //       {
  //         title: 'Mt dépôt', data: 'montant', render: function (data, type, row) {
  //           return new Intl.NumberFormat('fr-FR').format(row.montant);
  //         },
  //       },
  //       {
  //         title: 'Type de fcp', data: 'denominationOpcvm', render: function (data, type, row) {
  //           return row.denominationOpcvm;
  //         },
  //       },
  //       {
  //         title: 'Total', data: 'total', render: function (data, type, row) {
  //           return new Intl.NumberFormat('fr-FR').format(row.total);
  //         },
  //       },
  //       {
  //         title: 'Mode versement', data: 'modeVersement', render: function (data, type, row) {
  //           return ' ';
  //         },
  //       }
  //     ],
  //     createdRow: function (row, data, dataIndex) {
  //       $('td:eq(0)', row).addClass('d-flex align-items-center');
  //       // $('td:last-child', row).addClass('d-flex flex-row align-middle');
  //     },
  //   };
  //   // this.renderActionColumn();
  // }
  renderActionColumn(): void {
    const actionColumn = {
      sortable: false,
      title: 'Actions',
      class:'text-end min-w-70px',
      render: (data: any, type: any, full: any) => {
        const parentDivStart = `<div class="text-end min-w-70px">`;
        const viewButton = `
<!--          <div class="col-sm-4">-->
            <button class="btn btn-sm btn-info me-3" data-action="view" data-id="${full.idPays}">
                 Afficher
            </button>
<!--          </div>-->
        `;

        const editButton = `
<!--          <div class="col-sm-4">-->
            <button class="btn btn-sm btn-primary me-3" data-action="edit" data-id="${full.idPays}">
              Modifier
            </button>
<!--          </div>-->
        `;

        const deleteButton = `
<!--          <div class="col-sm-4">-->
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${full.idPays}">
              Supprimer
            </button>
<!--          </div>-->
        `;

        const parentDivEnd = `</div>`;

        const buttons = [];
        buttons.push(parentDivStart);
        buttons.push(viewButton);
        buttons.push(editButton);
        // buttons.push(deleteButton);
        buttons.push(parentDivEnd);

        return buttons.join('');
      },
    };

    if (this.datatableConfig.columns) {
    this.datatableConfig.columns.push(actionColumn);
  }
}

  // supprimer(id: number) {
  //   const modalRef = this.modalService.open(DeletePaysModalComponent);
  //   modalRef.componentInstance.id = id;
  //   modalRef.result.then(() => this.paysService.fetchRows(null), () => {});
  // }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

          case 'delete':
            // this.supprimer(id);
            break;
        }
      }
    });
  }
  imprimerDepot(){
    this.download=true;
    this.selectExercie=document.getElementById('comboExerciceCinq')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherOperationSupCinqMillionsEtat(this.codeExercice).pipe
    (finalize(()=>{
      this.download=false;
    })).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'depot_sup_cinq_millions.pdf';
      a.click();
    });
  }
  public openPDF(): void {
    let DATA: any = document.getElementById('reporting-sup-cinq-millions');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('liste des clients.pdf');
    });
  }
  generateExcelTable() {
    // /* pass here the table id */
    // const tableData = this.excel_table.nativeElement;
    // const ws: WorkSheet =utils.json_to_sheet(tableData);
    //
    // /* generate workbook and add the worksheet */
    // const wb: WorkBook = utils.book_new();
    // utils.book_append_sheet(wb, ws, 'Sheet1');
    //
    // /* save to file */
    // writeFile(wb, `dépôts-en-espèces-recensés-sur-l\'année.xlsx`);
    // this.exportAsExcelFile(tableData,"dépôts-en-espèces-recensés-sur-l\'année")
    let name="dépôts-supérieur-à-cinq-millions"
    const timeSpan = new Date().toISOString();
    const fileName = `${name}`;
    const targetTableElm = document.getElementById("reporting-sup-cinq-millions");
    const wb = XLSX.utils.table_to_book(targetTableElm, { sheet: "sheet1" } as
      XLSX.Table2SheetOpts);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  async downloadPdf() {
    var data = document.getElementById("reporting-sup-cinq-millions");
    // $("pdfOpenHide").attr("hidden", true);
    // To disable the scroll
    // @ts-ignore
    document.getElementById("alldata").style.overflow = "inherit";
    // @ts-ignore
    document.getElementById("alldata").style.maxHeight = "inherit";

    // @ts-ignore
    await html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // @ts-ignore
        document.getElementById("alldata").style.overflow = "scroll";
        // @ts-ignore
        document.getElementById("alldata").style.maxHeight = "150px";

        // @ts-ignore
        let pdf = new jsPDF("l", "mm", "a4"); // A4 size page of PDF

        let imgWidth = 300;
        let pageHeight = pdf.internal.pageSize.height;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('dépôts-supérieur-à-cinq-millions.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}

