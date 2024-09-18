import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, switchMap} from "rxjs";
import {Personne} from "../../../models/personne/personne.model";
import {PersonnePhysiqueService} from "../../../services/personne/personne.physique.service";
import {ActivatedRoute} from "@angular/router";
import {PersonneMoraleService} from "../../../services/personne/personne.morale.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {DataTablesResponse} from "../../../models/data-tables.response.model";
import {Config} from "datatables.net";

@Component({
  selector: 'app-prospect-print',
  templateUrl: './prospect-print.component.html',
  styleUrls: ['./prospect-print.component.scss']
})
export class ProspectPrintComponent implements OnInit, OnDestroy{
  baseRoute: string = "";
  qualite?: string | null;
  entity: any;
  newButtonTitle: string = "Nouveau";
  personnes$: any;
  title: string;
  prospect: string;
  isLoading: boolean = false;
  dateJour:Date;
  private subscriptions: Subscription[] = [];
  personnes: DataTablesResponse<any>;

  datatableConfig: Config = {};
  afficherPersonnePhysique:boolean;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  aPersonne: Observable<Personne>;

  selectProspect:any;
  constructor(
    public personnePhysiqueService: PersonnePhysiqueService,
    public personneMoraleService: PersonneMoraleService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.prospect="Personne physique";
    this.selectProspect = document.getElementById("ComboProspect");
    this.dateJour = new Date();
  }
  afficherProspect(){
    this.prospect=this.selectProspect.options[this.selectProspect.selectedIndex].text;
    if(this.prospect=="Personne physique"){
      this.qualite="prospect";
      this.personnes$ = this.route.paramMap.pipe(switchMap(() => this.personnePhysiqueService.afficherPersonneSelonQualite(this.qualite)));
    }
    else
    {
      this.qualite="prospect"
      this.personnes$ = this.route.paramMap.pipe(switchMap(() => this.personneMoraleService.afficherPersonneSelonQualite(this.qualite)));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  convertToPDF() {
    html2canvas(document.getElementById('reporting')!).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      let width = pdf.internal.pageSize.getWidth();
      let height = canvas.height * width / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save('output.pdf');
    })
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
      PDF.save('liste des prospects.pdf');
    });
  }
  async downloadPdf(name:any,alldata:any) {
    var data = document.getElementById(name);
    // $("pdfOpenHide").attr("hidden", true);
    // To disable the scroll
    // @ts-ignore
    document.getElementById(alldata).style.overflow = "inherit";
    // @ts-ignore
    document.getElementById(alldata).style.maxHeight = "inherit";

    // @ts-ignore
    await html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // @ts-ignore
        document.getElementById(alldata).style.overflow = "scroll";
        // @ts-ignore
        document.getElementById(alldata).style.maxHeight = "150px";

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
        pdf.save('liste des prospects.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}

