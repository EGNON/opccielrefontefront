import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Personne} from "../../../models/personne/personne.model";
import {PersonnePhysiqueService} from "../../../services/personne/personne.physique.service";
import {PersonneMoraleService} from "../../../services/personne/personne.morale.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {DataTablesResponse} from "../../../models/data-tables.response.model";
import {Config} from "datatables.net";

@Component({
  selector: 'app-clientnayantinvesti',
  templateUrl: './clientnayantinvesti.component.html',
  styleUrls: ['./clientnayantinvesti.component.scss']
})
export class ClientnayantinvestiComponent implements OnInit, OnDestroy{
  baseRoute: string = "";
  qualite?: string | null;
  entity: any;
  newButtonTitle: string = "Nouveau";
  personnes$: any;
  title: string;
  prospect: string;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  personnes: DataTablesResponse<any>;
  formData:FormGroup;
  datatableConfig: Config = {};
  afficherPersonnePhysique:boolean;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  aPersonne: Observable<Personne>;
  dateDebut:any;
  dateJour:Date;
  dateFin:any;
  selectProspect:any;
  constructor(
    public personnePhysiqueService: PersonnePhysiqueService,
    public personneMoraleService: PersonneMoraleService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    let dDate=new Date();
    this.dateDebut=dDate+"T00:00:00";
    this.dateFin=dDate+"T23:59:59";
    this.formData = this.fb.group(
      {
        dateDebut: [this.formatDate(dDate), Validators.required],
        dateFin: [this.formatDate(dDate),Validators.required]});
    this.prospect="Personne physique";
    this.selectProspect = document.getElementById("ComboClientNonInvesti");
    this.dateJour=new Date();
  }
  private formatDate(date:Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  afficherClient(){
    this.prospect=this.selectProspect.options[this.selectProspect.selectedIndex].text;
    this.dateDebut=this.formData.get('dateDebut')?.value+"T00:00:00";
    this.dateFin=this.formData.get('dateFin')?.value+"T23:59:59";
    if(this.prospect=="Personne physique"){
      this.qualite="actionnaires".toUpperCase();
      this.personnePhysiqueService.afficherPersonnePhysiqueNayantPasInvesti(this.qualite,this.dateDebut,this.dateFin).subscribe(
        (data)=>{
          this.personnes$=data;
        }
      )
    }
    else
    {
      this.qualite="actionnaires".toUpperCase()
      this.personneMoraleService.afficherPersonneMoraleNayantPasInvesti(this.qualite,this.dateDebut,this.dateFin).subscribe(
        (data)=>{
          this.personnes$=data;
        }
      )
    }
  }
  imprimer(){
    this.prospect=this.selectProspect.options[this.selectProspect.selectedIndex].text;
    this.dateDebut=this.formData.get('dateDebut')?.value+"T00:00:00";
    this.dateFin=this.formData.get('dateFin')?.value+"T23:59:59";
    if(this.prospect=="Personne physique"){
      this.qualite="actionnaires".toUpperCase();
      this.personnePhysiqueService.afficherPersonnePhysiqueNayantPasInvestiEtat(this.qualite,this.dateDebut,this.dateFin).subscribe(
        (data)=>{

        }
      )
    }
    else
    {
      this.qualite="actionnaires".toUpperCase()
      this.personneMoraleService.afficherPersonneMoraleNayantPasInvestiEtat(this.qualite,this.dateDebut,this.dateFin).subscribe(
        (data)=>{

        }
      )
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
      PDF.save('liste des clients n\'ayant pas investi.pdf');
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
        pdf.save('liste des clients n\'ayant pas investi.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}


