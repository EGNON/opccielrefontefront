import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {finalize, Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {DataTableDirective} from "angular-datatables";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {OperationService} from "../../../services/operation.service";
import {ShareService} from "../../../services/share.service";
import {ExerciceService} from "../../../services/exercice.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx-js-style';
import {Config} from "datatables.net";

@Component({
    selector: 'app-operationconditioninhabituelle',
    templateUrl: './operationconditioninhabituelle.component.html',
    styleUrl: './operationconditioninhabituelle.component.scss',
    standalone: false
})
export class OperationconditioninhabituelleComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  datatableConfig: Config = {};
  exercice$:any;
  operationSouscriptionRachat$:any;
  annee:any;
  download:boolean;
  selectAnnee:any;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
  dateDuJour:Date;
  swalOptions: SweetAlertOptions = {};
  public dt: DataTableDirective;
  public isDtInit: boolean = false;
  // dtTrigger: Subject<any> = new Subject();
  private clickListener: () => void;
  private idInAction: number;


  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public operationService:OperationService,
    public sharedService:ShareService,
    public exerciceService:ExerciceService,
    public pageInfo:PageInfoService,
    private router: Router,
    private modalService: NgbModal) {}
  @ViewChild('excel_table', { static: false }) excel_table: ElementRef;

  ngOnInit(): void {
    this.afficherExercice()
    this.pageInfo.updateTitle("Point des transactions personnes physiques " +
      "supérieures ou égales à 10 000 000 effectuées dans les conditions inhabituelles sur l'année")
    // this.afficherDepot();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.dtInit()
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
   exporterExcel(): void {
      const donneesExcel = this.operationSouscriptionRachat$.map(operation => ({
        'Date opération': operation.dateOperation
          ? new Date(operation.dateOperation).toLocaleDateString('fr-FR')
          : '',
  
        'Actionnaire': operation.denomination ?? '',
  
        'Montant déposé': operation.montantDepose ?? 0,
  
        'Type de FCP': operation.denominationOpcvm ?? '',
  
        'Total': operation.total ?? 0,
  
        'Date première souscription': operation.datePremiereSouscription
          ? new Date(operation.datePremiereSouscription).toLocaleDateString('fr-FR')
          : ''
      }));
  
      const feuille: XLSX.WorkSheet = XLSX.utils.json_to_sheet(donneesExcel);
  
      // Largeur des colonnes
      feuille['!cols'] = [
        { wch: 18 }, // Date opération
        { wch: 35 }, // Dénomination
        { wch: 20 }, // Montant déposé
        { wch: 30 }, // OPCVM
        { wch: 20 }, // Total
        { wch: 25 }  // Date première souscription
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
        'opérations supérieures ou égales à 10 000 000 effectuées dans les conditions inhabituelles sur l\'année.xlsx'
      );
    }
  afficherExercice(){
    this.exerciceService.afficherTous().subscribe(
      (data)=>{
        this.exercice$=data;
      }
    )
  }
  afficherOperation(){
    this.selectAnnee=document.getElementById('comboAnneeInhabituelle')
    this.annee=this.selectAnnee.options[this.selectAnnee.selectedIndex].text;
    this.operationService.afficherTransactionInhabituelle(this.annee).subscribe(
      (data)=>{
        this.operationSouscriptionRachat$=data;
      }
    )
  }
  imprimer(){
    this.download=true
    this.selectAnnee=document.getElementById('comboAnneeInhabituelle')
    this.annee=this.selectAnnee.options[this.selectAnnee.selectedIndex].text;
    this.operationService.afficherTransactionInhabituelleEtat(this.annee).pipe
    (finalize(()=>{
      this.download=false;
    })).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'operation_condition_inhabituelle.pdf';
      a.click();
    });
  }
  public dtInit(): void {
    if (this.isDtInit) {
      this.dt.dtInstance.then(dtInstance => {
        dtInstance.destroy();
        // this.dtTrigger.next();
      });
    } else this.isDtInit = true;
  }

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
  onTableDataChange(event: any) {
    this.page = event;
    this.afficherOperation();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.afficherOperation();
  }
  // download()
  // {
  //   let doc=new jsPDF('p', 'mm', "a4");
  //   (doc as jsPDF & { autoTable: autoTable }).
  //   autoTable({html: '#reporting-nouvelle-relation',
  //     headStyles : {fillColor : '#414ab1'},
  //     startY: 70,
  //     margin: { horizontal: 10 },
  //     styles: { overflow: "linebreak" },
  //     didDrawPage: function (data) {
  //
  //       // Header
  //       doc.setFontSize(15);
  //       doc.setTextColor(40);
  //       var text="Date:"+new Date()+"\n" +
  //         "SAPHIR ASSET MANAGEMENT \n" +
  //         "Tél : +229 20 21 35 10/66 18 01 74 \n" +
  //         "Addresse: Rue du Gouverneur Gal Félix EBOUE R. 5.160 CARRE 211 ST MICHEL,3ème étage de " +
  //         "l'immeuble de la SGI BENIN"
  //       doc.text(text, data.settings.margin.left, 22);
  //
  //       // Footer
  //       var str = "Page " + doc.internal.pageSize.getHeight();
  //
  //       doc.setFontSize(10);
  //
  //       // jsPDF 1.4+ uses getWidth, <1.4 uses .width
  //       var pageSize = doc.internal.pageSize;
  //       var pageHeight = pageSize.height
  //         ? pageSize.height
  //         : pageSize.getHeight();
  //       doc.text(str, data.settings.margin.left, pageHeight - 10);
  //     }}
  //   );
  //   doc.save('ok.pdf');
  // }
  // generateExcelTable() {
  //   /* pass here the table id */
  //   const tableData = this.excel_table.nativeElement;
  //   const ws: WorkSheet =utils.table_to_sheet(tableData);
  //
  //   /* generate workbook and add the worksheet */
  //   const wb: WorkBook = utils.book_new();
  //   utils.book_append_sheet(wb, ws, 'Sheet1');
  //
  //   /* save to file */
  //   writeFile(wb, `opération-effectuée-condition-inhabituelle.xlsx`);
  //
  // }
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
    let name="opération-effectuée-condition-inhabituelle"
    const timeSpan = new Date().toISOString();
    const fileName = `${name}`;
    const targetTableElm = document.getElementById("reporting-condition-inhabituelle");
    const wb = XLSX.utils.table_to_book(targetTableElm, { sheet: "sheet1" } as
      XLSX.Table2SheetOpts);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  async downloadPdf() {
    var data = document.getElementById("reporting-condition-inhabituelle");
    // $("pdfOpenHide").attr("hidden", true);
    // To disable the scroll
    // @ts-ignore
    document.getElementById("alldata-condition-inhabituelle").style.overflow = "inherit";
    // @ts-ignore
    document.getElementById("alldata-condition-inhabituelle").style.maxHeight = "inherit";

    // @ts-ignore
    await html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // @ts-ignore
        document.getElementById("alldata-condition-inhabituelle").style.overflow = "scroll";
        // @ts-ignore
        document.getElementById("alldata-condition-inhabituelle").style.maxHeight = "150px";

        // @ts-ignore
        // let pdf = new jsPDF("l", "mm", "A4"); // A4 size page of PDF
        let pdf = new jsPDF('p', 'mm', "a4"); // A4 size page of PDF

        let imgWidth = 210;
        let pageHeight = pdf.internal.pageSize.height;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        console.log(imgHeight)
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('opération-effectuée-condition-inhabituelle.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
  clickMe(){
    // this.sharedService.sendClickEventConditionInhabituelle();
    this.afficherOperation();
  }
}

