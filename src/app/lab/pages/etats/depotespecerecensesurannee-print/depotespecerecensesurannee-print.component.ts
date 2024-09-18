import {Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {ShareService} from "../../../services/share.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {OperationService} from "../../../services/operation.service";
import {Config} from "datatables.net";

@Component({
  selector: 'app-depotespecerecensesurannee-print',
  templateUrl: './depotespecerecensesurannee-print.component.html',
  styleUrl: './depotespecerecensesurannee-print.component.scss'
})
export class DepotespecerecensesuranneePrintComponent implements OnInit, OnDestroy{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  dateJour:Date;
  aEntity: Observable<any>;
  depotRachat$: any;
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  swalOptions: SweetAlertOptions = {};
  codeExercice:any;
  selectExercie:any;
  clickEventsubscription:Subscription;
  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public operationService:OperationService,
    private sharedService: ShareService,
    private router: Router,
    private modalService: NgbModal) {
    this.clickEventsubscription=    this.sharedService.getClickEventRecenseSurAnnee().subscribe(()=>{
      this.afficherDepot();
    })
  }

  ngOnInit(): void {
    this.dateJour=new Date();
    // this.afficherDepot();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherDepot(){
    this.selectExercie=document.getElementById('comboExercice')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherListeDepotRecenseSurAnnee(this.codeExercice).subscribe(
      (data)=>{
        this.depotRachat$=data;
      }
    )
  }
  public openPDF(name:any): void {
    let DATA: any = document.getElementById(name);
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('dépôts-supérieur-à-cinq-millions.pdf');
    });
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
}

