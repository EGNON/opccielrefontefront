import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as jspdf from "jspdf";
import {OperationService} from "../../../services/operation.service";
import {ShareService} from "../../../services/share.service";
import {Config} from "datatables.net";

@Component({
    selector: 'app-depotsuperieuracinqmillions-print',
    templateUrl: './depotsuperieuracinqmillions-print.component.html',
    styleUrl: './depotsuperieuracinqmillions-print.component.scss',
    standalone: false
})
export class DepotsuperieuracinqmillionsPrintComponent implements OnInit, OnDestroy{
  isLoading: boolean;
private subscriptions: Subscription[] = [];
  dateJour:Date;
  aEntity: Observable<any>;
  depotRachat$: any;
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  codeExercice:any;
  selectExercie:any;
  swalOptions: SweetAlertOptions = {};
  clickEventsubscription:Subscription;
private clickListener: () => void;
private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public operationService:OperationService,
    public sharedService:ShareService,
    private router: Router,
    private modalService: NgbModal) {
    this.clickEventsubscription=    this.sharedService.getClickEventCinq().subscribe(()=>{
    this.afficherDepot();
  })}

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
    this.selectExercie=document.getElementById('comboExerciceCinq')
    this.codeExercice=this.selectExercie.options[this.selectExercie.selectedIndex].text;
    this.operationService.afficherOperationSupCinqMillions(this.codeExercice).subscribe(
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

