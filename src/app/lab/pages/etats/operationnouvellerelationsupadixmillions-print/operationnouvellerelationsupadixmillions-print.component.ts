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
  selector: 'app-operationnouvellerelationsupadixmillions-print',
  templateUrl: './operationnouvellerelationsupadixmillions-print.component.html',
  styleUrl: './operationnouvellerelationsupadixmillions-print.component.scss'
})
export class OperationnouvellerelationsupadixmillionsPrintComponent implements OnInit, OnDestroy{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  dateJour:Date;
  aEntity: Observable<any>;
  operationSouscriptionRachat$: any;
  datatableConfig: Config = {};
  annee:any;
  selectAnnee:any;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};
  clickEventsubscription:Subscription;
  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    private sharedService: ShareService,
    public operationService:OperationService,
    private router: Router,
    private modalService: NgbModal) {
    this.clickEventsubscription=    this.sharedService.getClickEventNouvelleRelation().subscribe(()=>{
      this.afficherOperation();
    })
  }

  ngOnInit(): void {
    this.dateJour=new Date();
     // this.afficherOperation();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherOperation(){
    this.dateJour=new Date();
    this.selectAnnee=document.getElementById('comboAnnee')
    this.annee=this.selectAnnee.options[this.selectAnnee.selectedIndex].text;
    this.operationService.afficherOperationNouvelleRelationSupADixMillions(this.annee).subscribe(
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
    var data = document.getElementById("reporting-nouvelle-relation");
    // $("pdfOpenHide").attr("hidden", true);
    // To disable the scroll
    // @ts-ignore
    document.getElementById("alldata-nouvelle-relation").style.overflow = "inherit";
    // @ts-ignore
    document.getElementById("alldata-nouvelle-relation").style.maxHeight = "inherit";

    // @ts-ignore
    await html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // @ts-ignore
        document.getElementById("alldata-nouvelle-relation").style.overflow = "scroll";
        // @ts-ignore
        document.getElementById("alldata-nouvelle-relation").style.maxHeight = "150px";

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
        pdf.save('opération-constituant-de-nouvelle-relation.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}


