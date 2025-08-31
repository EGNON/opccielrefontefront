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
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExerciceService} from "../../../services/exercice.service";
import {DataTableDirective} from "angular-datatables";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {ShareService} from "../../../services/share.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OperationService} from "../../../services/operation.service";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {Config} from "datatables.net";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
    selector: 'app-depotespecerecensesurannee',
    templateUrl: './depotespecerecensesurannee.component.html',
    styleUrl: './depotespecerecensesurannee.component.scss',
    standalone: false
})
export class DepotespecerecensesuranneeComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  datatableConfig: Config = {};
  exercice$:any;
  depotRachat$:any;
  codeExercice:any;
  selectExercie:any;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  swalOptions: SweetAlertOptions = {};
  public dt: DataTableDirective;
  public isDtInit: boolean = false;
  // dtTrigger: Subject<any> = new Subject();
  private clickListener: () => void;
  private idInAction: number;
  @ViewChild('excel_table_Recense_Annee', { static: false }) excel_table: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public operationService:OperationService,
    private sharedService: ShareService,
    private pageInfo: PageInfoService,
    public exerciceService:ExerciceService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherExercice()
    this.pageInfo.updateTitle("Détermination du solde global de l'ensemble des comptes détenus par un même client")
    // this.afficherDepot();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.dtInit()
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherExercice(){
    this.exerciceService.afficherTous().subscribe(
      (data)=>{
        this.exercice$=data;
      }
    )
  }
  afficherDepotSurAnnee(){
    this.selectExercie=document.getElementById('comboExercice')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherListeDepotRecenseSurAnnee(this.codeExercice).subscribe(
      (data)=>{
        this.depotRachat$=data;
      }
    )
  }
  imprimer(){
    this.selectExercie=document.getElementById('comboExercice')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherListeDepotRecenseSurAnneeEtat(this.codeExercice).subscribe(
      (data)=>{
        // this.depotRachat$=data;
      }
    )
  }
  public dtInit(): void {
    if (this.isDtInit) {
      this.dt.dtInstance.then(dtInstance => {
        dtInstance.destroy();
        // this.dtTrigger.next();
      });
    } else this.isDtInit = true;
  }

  afficherDepotRecenseSurAnnee(){
    // this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    // this.datatableConfig = {
    //   serverSide: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     const sb = this.depotRachatService.afficherDepotRecenseSurAnnee(dataTablesParameters,this.codeExercice)
    //       .subscribe(resp => {
    //         callback(resp);
    //       });
    //     this.subscriptions.push(sb);
    //   },
    //   columns: [
    //     {
    //       title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
    //         return moment(row.dateOperation).format('DD/MM/YYYY');
    //       },
    //     },
    //     // {
    //     //   title: 'Type', data: 'typeOperation', render: function (data, type, row) {
    //     //     return row?.typeOperation;
    //     //   },
    //     // },
    //     {
    //       title: 'Actionnaire', data: 'actionnaire', render: function (data, type, row) {
    //         return row.nomPersonnePhysique+' '+row.prenomPersonnePhysique;
    //       },
    //     },
    //     {
    //       title: 'Mt dépôt', data: 'montant', render: function (data, type, row) {
    //         return new Intl.NumberFormat('fr-FR').format(row.montant);
    //       },
    //     },
    //     {
    //       title: 'Type de fcp', data: 'denominationOpcvm', render: function (data, type, row) {
    //         return row.denominationOpcvm;
    //       },
    //     },
    //     {
    //       title: 'Total', data: 'total', render: function (data, type, row) {
    //         return '';
    //       },
    //     },
    //     {
    //       title: 'Mode versement', data: 'modeVersement', render: function (data, type, row) {
    //         return ' ';
    //       },
    //     }
    //   ],
    //   createdRow: function (row, data, dataIndex) {
    //     $('td:eq(0)', row).addClass('d-flex align-items-center');
    //     // $('td:last-child', row).addClass('d-flex flex-row align-middle');
    //   },
    // };
    // this.renderActionColumn();
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
    this.afficherDepotSurAnnee();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.afficherDepotSurAnnee();
  }

  generateExcelTable() {
    // /* pass here the table id */
    const tableData = this.excel_table.nativeElement;
    // const ws: WorkSheet =utils.json_to_sheet(tableData);
    //
    // /* generate workbook and add the worksheet */
    // const wb: WorkBook = utils.book_new();
    // utils.book_append_sheet(wb, ws, 'Sheet1');
    //
    // /* save to file */
    // writeFile(wb, `dépôts-en-espèces-recensés-sur-l\'année.xlsx`);
    // this.exportAsExcelFile(tableData,"dépôts-en-espèces-recensés-sur-l\'année")
    let name="dépôts-en-espèces-recensés-sur-l'année"
    const timeSpan = new Date().toISOString();
    const fileName = `${name}`;
    const targetTableElm = document.getElementById("reporting-recense");
    const wb = XLSX.utils.table_to_book(targetTableElm, { sheet: "sheet1" } as
      XLSX.Table2SheetOpts);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  public exportAsExcelFile(data: { [key: string]: any }[], name?: string): void {
    // const timeSpan = new Date().toISOString();
    // const fileName = `${name}-${timeSpan}`;
    // const worksheet = utils.json_to_sheet(data);
    // const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: "xlsx",
    //   type: "array",
    // });
    // this.saveAsExcelFile(excelBuffer, `${fileName}.xlsx`);
    const timeSpan = new Date().toISOString();
    const fileName = `${name}-${timeSpan}`;
    const targetTableElm = document.getElementById("reporting-recense");
    const wb = XLSX.utils.table_to_book(targetTableElm, { sheet: name } as
      XLSX.Table2SheetOpts);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported'+ EXCEL_EXTENSION);
  }

  async downloadPdf() {
    var data = document.getElementById("reporting-recense");
    // $("pdfOpenHide").attr("hidden", true);
    // To disable the scroll
    // @ts-ignore
    document.getElementById("alldata-recense").style.overflow = "inherit";
    // @ts-ignore
    document.getElementById("alldata-recense").style.maxHeight = "inherit";

    // @ts-ignore
    await html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // @ts-ignore
        document.getElementById("alldata-recense").style.overflow = "scroll";
        // @ts-ignore
        document.getElementById("alldata-recense").style.maxHeight = "150px";

        // @ts-ignore
        let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF

        let imgWidth = 210;
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
        pdf.save('dépôts-en-espèces-recensés-sur-l\'année.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
  clickMe(){
    // this.sharedService.sendClickEventRecenseSurAnnee();
    this.afficherDepotSurAnnee();
  }
}

