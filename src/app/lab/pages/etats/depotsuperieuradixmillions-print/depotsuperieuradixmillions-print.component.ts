import {Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {DepotRachatService} from "../../../services/depotrachat.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {ShareService} from "../../../services/share.service";
import {OperationService} from "../../../services/operation.service";
import {Config} from "datatables.net";

@Component({
  selector: 'app-depotsuperieuradixmillions-print',
  templateUrl: './depotsuperieuradixmillions-print.component.html',
  styleUrl: './depotsuperieuradixmillions-print.component.scss'
})
export class DepotsuperieuradixmillionsPrintComponent implements OnInit, OnDestroy{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  dateJour:Date;
  aEntity: Observable<any>;
  depotRachat$: any;
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  operationSouscriptionRachat$:any;
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
    this.clickEventsubscription=    this.sharedService.getClickEvent().subscribe(()=>{
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
    this.selectExercie=document.getElementById('comboExercice2')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherOperationSupDixMillions(this.codeExercice).subscribe(
      (data)=>{
        this.operationSouscriptionRachat$=data;
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

