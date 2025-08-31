import {Component, Input, OnInit} from '@angular/core';
import {CompterenduService} from "../../../services/compterendu.service";
import {PersonnelService} from "../../../services/personne/personnel.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
    selector: 'app-produitsouscrit-print',
    templateUrl: './produitsouscrit-print.component.html',
    styleUrls: ['./produitsouscrit-print.component.scss'],
    standalone: false
})
export class ProduitsouscritPrintComponent implements OnInit{
  personnel$:any;
  compteRendu$:any;
  idPersonnel:number;
  selectPersonnel:any;
  personnelSelectionnee:any;
  denomination:string;
  afficherTous:boolean;
  formData: FormGroup;
  dateDeb:any;
  dateJour:Date;
  dateFin:any;
  @Input() selectedItem: any;
  constructor(
    public compteRenduService: CompterenduService,
    public personnelService:PersonnelService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    let dDate=new Date();
    this.dateJour=dDate;
    this.formData = this.fb.group(
      {
        dateDeb: [this.formatDate(dDate), Validators.required],
        dateFin: [this.formatDate(dDate),Validators.required]});
    this.afficherPersonnel()
    // this.afficherRDV()
    this.selectPersonnel = document.getElementById("ComboPersonnel");

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
  afficherProduitSouscrit()
  {

      this.personnelSelectionnee=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].value;

      this.idPersonnel=this.personnelSelectionnee;
      this.dateDeb=this.formData.get('dateDeb')?.value+"T00:00:00";
      this.dateFin=this.formData.get('dateFin')?.value+"T23:59:59";
      if(this.personnelSelectionnee==="Tous")
        this.idPersonnel=0

        this.compteRenduService.afficherCompteRenduSelonRealisation(this.idPersonnel,this.dateDeb,this.dateFin).subscribe(
          (data) => {
            this.compteRendu$=data;
          }
        );
  }
  afficherPersonnel(){
    this.personnelService.afficherPersonnelSelonEstCommercial().subscribe(
      (data) => {
        this.personnel$=data;
      }
    );
  }
  selectItem(item: any) {
    this.selectedItem = item;
  }
  print(){
    // @ts-ignore
    var printContents = document.getElementById('print-section').innerHTML;
    var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
    // @ts-ignore
    popupWin.window.focus();
    // @ts-ignore
    popupWin.document.open();
    // @ts-ignore
    popupWin.document.write('<!DOCTYPE html><html><head><title>Liste des rendez-vous planifiés</title>'
      +'<link rel="stylesheet"  media="print" href="/src/app/pages/etats/css/print.css"/>'
      +'<style type="text/css">.t1{border: black}</style></head><body onload="window.print(); window.close();"><div>'
      + printContents + '</div></html>');
    // @ts-ignore
    popupWin.document.close();
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
      PDF.save('liste des souscriptions.pdf');
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
        pdf.save('liste des souscriptions.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}
