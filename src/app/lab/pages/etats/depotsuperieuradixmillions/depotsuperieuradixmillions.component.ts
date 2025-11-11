import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {finalize, Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {DataTableDirective} from "angular-datatables";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {DepotRachatService} from "../../../services/depotrachat.service";
import {ExerciceService} from "../../../services/exercice.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ShareService} from "../../../services/share.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OperationService} from "../../../services/operation.service";
import * as XLSX from "xlsx";
import {Api, Config} from "datatables.net";

@Component({
    selector: 'app-depotsuperieuradixmillions',
    templateUrl: './depotsuperieuradixmillions.component.html',
    styleUrl: './depotsuperieuradixmillions.component.scss',
    standalone: false
})
export class DepotsuperieuradixmillionsComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  datatableConfig: Config = {};
  exercice$:any;
  operationSouscriptionRachat$:any;
  codeExercice:any;
  download:boolean;
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

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public operationService:OperationService,
    public exerciceService:ExerciceService,
    private sharedService: ShareService,
    private pageInfo: PageInfoService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherExercice()
    this.pageInfo.updateTitle("Point des transactions personnes physiques supérieures ou égales à 10 000 000 sur l'année")
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
    this.selectExercie=document.getElementById('comboExercice2')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherOperationSupDixMillions(this.codeExercice).subscribe(
      (data)=>{
        this.operationSouscriptionRachat$=data;
      }
    )
  }
  imprimer(){
    this.download=true
    this.selectExercie=document.getElementById('comboExercice2')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherOperationSupDixMillionsEtat(this.codeExercice).pipe
    (finalize(()=>{
      this.download=false;
    })).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'depot_superieur_a_dix_millions.pdf';
      a.click();
    });
  }
  public dtInit(): void {
    if (this.isDtInit) {
      this.dt.dtInstance.then(value => {
        value.destroy();
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
    this.afficherDepotSurAnnee();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.afficherDepotSurAnnee();
  }
  clickMe(){
    // this.sharedService.sendClickEvent();
    this.afficherDepotSurAnnee();
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
    let name="dépôts-supérieur-à-dix-millions"
    const timeSpan = new Date().toISOString();
    const fileName = `${name}`;
    const targetTableElm = document.getElementById("reporting-dix-millions");
    const wb = XLSX.utils.table_to_book(targetTableElm, { sheet: "sheet1" } as
      XLSX.Table2SheetOpts);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  async downloadPdf() {
    var data = document.getElementById("reporting-dix-millions");
    // $("pdfOpenHide").attr("hidden", true);
    // To disable the scroll
    // @ts-ignore
    document.getElementById("alldata-dix-millions").style.overflow = "inherit";
    // @ts-ignore
    document.getElementById("alldata-dix-millions").style.maxHeight = "inherit";

    // @ts-ignore
    await html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // @ts-ignore
        document.getElementById("alldata-dix-millions").style.overflow = "scroll";
        // @ts-ignore
        document.getElementById("alldata-dix-millions").style.maxHeight = "150px";

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
        pdf.save('dépôts-supérieur-à-dix-millions.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}

