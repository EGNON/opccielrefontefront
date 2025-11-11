import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {finalize, Observable, Subscription, switchMap} from "rxjs";
import {Personne} from "../../../models/personne/personne.model";
import {PersonnePhysiqueService} from "../../../services/personne/personne.physique.service";
import {PersonneMoraleService} from "../../../services/personne/personne.morale.service";
import {ActivatedRoute} from "@angular/router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {DataTablesResponse} from "../../../models/data-tables.response.model";
import {Config} from "datatables.net";

@Component({
    selector: 'app-client-print',
    templateUrl: './client-print.component.html',
    styleUrls: ['./client-print.component.scss'],
    standalone: false
})
export class ClientPrintComponent implements OnInit, OnDestroy{
  baseRoute: string = "";
  qualite?: string | null;
  entity: any;
  download:boolean;
  dateJour:Date;
  newButtonTitle: string = "Nouveau";
  personnes$: any;
  title: string;
  prospect: string;
  isLoading: boolean = false;
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
    private route: ActivatedRoute) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.prospect="Personne physique";
    this.selectProspect = document.getElementById("ComboClient");
    this.dateJour=new Date();
  }
  afficherClient(){
    this.prospect=this.selectProspect.options[this.selectProspect.selectedIndex].text;
    if(this.prospect=="Personne physique"){
      this.qualite="actionnaires".toUpperCase();
      this.personnes$ = this.route.paramMap
        .pipe(
          // filter(paramMap => paramMap.has('qualite')),
          // map(paramMap => paramMap.get('qualite')!),
          // tap((qualite) => {
          //   // const voyelles = ['a', 'e', 'y', 'u', 'i', 'o'];
          //   this.qualite = qualite;
          //   // this.baseRoute = `/standard/parametre/personne/physique/${qualite}`;
          //   // this.newButtonTitle = this.qualite ? ((voyelles.includes(this.qualite[0]) ? 'Nouvel ' : 'Nouveau ') + `${this.qualite}`) : this.newButtonTitle;
          //   menuReinitialization();
          // }),
          switchMap((qualite) => this.personnePhysiqueService.afficherPersonneSelonQualite(this.qualite))
        );
    }
    else
    {
      this.qualite="actionnaires".toUpperCase()
      this.personnes$ = this.route.paramMap
        .pipe(
          switchMap((qualite) => this.personneMoraleService.afficherPersonneSelonQualite(this.qualite))
        );
    }
  }
  imprimer(){
     this.download=true
    this.prospect=this.selectProspect.options[this.selectProspect.selectedIndex].text;
    if(this.prospect=="Personne physique"){
      this.qualite="actionnaires".toUpperCase();
      this.personnePhysiqueService.afficherPersonneSelonQualiteEtat(this.qualite).pipe
      (finalize(()=>{
        this.download=false;
      })).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'client_physique.pdf';
        a.click();
      });
    }
    else
    {
      this.qualite="actionnaires".toUpperCase();
      this.personneMoraleService.afficherPersonneSelonQualiteEtat(this.qualite).pipe
      (finalize(()=>{
        this.download=false;
      })).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'client_Morale.pdf';
        a.click();
      });
    }
  }
  ngOnDestroy(): void {

    this.subscriptions.forEach((sb) => sb.unsubscribe());
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
      PDF.save('liste des clients.pdf');
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
        pdf.save('liste des clients.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}

