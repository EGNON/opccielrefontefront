import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PersonnelService} from "../../../services/personne/personnel.service";
import {ObjectifAffecteService} from "../../../services/objectif-affecte.service";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-objectif-print',
  templateUrl: './objectif-print.component.html',
  styleUrls: ['./objectif-print.component.scss']
})
export class ObjectifPrintComponent implements OnInit, OnDestroy{
  isLoading: boolean;
  objectifAffecte$: any;
  idPersonne:number;
  idPeriodicite:number;
  dateJour:Date;
  selectPersonnel:any;
  selectPeriodicite:any;
  personnel$:any;
  formData:FormGroup;
  etatFourni:boolean;
  etatPrevu:boolean;
  periodicite$:any;
  constructor(
    public objectifAffecteService: ObjectifAffecteService,
    public personnelService: PersonnelService,
    public periodiciteService: PeriodiciteService,
    private fb: FormBuilder,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.formData = this.fb.group(
      {
        etatFourni:[null],
        etatPrevu:[null],
      }
    );
    this.selectPersonnel = document.getElementById("ComboPersonnelEtat");
    this.selectPeriodicite = document.getElementById("ComboPeriodicite");
    this.etatPrevu=true;
    this.afficherPersonnel();
    this.afficherPeriodicite();
    this.dateJour=new Date();
  }
  etatPrevuChange(){
    // @ts-ignore
    this.etatPrevu = document.getElementById("etatPrevu").checked;
    if(this.etatPrevu)
    {
      this.etatFourni=false;
    }
  }
  etatFourniChange(){
    // console.log("ok")
    // @ts-ignore
    this.etatFourni = document.getElementById("etatFourni").checked;

    if(this.etatFourni)
    {
      this.etatPrevu=false;
    }
  }
  afficherObjetif(){
    // @ts-ignore
    this.etatPrevu = document.getElementById("etatPrevu").checked;
    // console.log(this.etatPrevu)
    this.idPersonne=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].value;
    this.idPeriodicite=this.selectPeriodicite.options[this.selectPeriodicite.selectedIndex].value;
    this.objectifAffecteService.afficherSelonPersonnelEtPeriodicite(this.idPersonne,this.idPeriodicite).subscribe(
      (data)=>{
        this.objectifAffecte$=data;
        // console.log(this.objectifAffecte$)
      }
    )
  }
  afficherPersonnel(){
    this.personnelService.afficherPersonnelSelonEstCommercial().subscribe(
      (data) => {
        this.personnel$=data;
      }
    );
  }
  afficherPeriodicite(){
    this.periodiciteService.afficherTous().subscribe(
      (data) => {
        this.periodicite$=data;
      }
    );
  }
  ngOnDestroy(): void {}
  public openPDF(name:any): void {
    let DATA: any = document.getElementById(name);
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Point périodique des objectifs.pdf');
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
        pdf.save('Point périodique des objectifs.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}

