import {Component, Input, OnInit} from '@angular/core';
import {PersonnelService} from "../../../services/personne/personnel.service";
import {CompterenduService} from "../../../services/compterendu.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-compterendu-print',
  templateUrl: './compterendu-print.component.html',
  styleUrls: ['./compterendu-print.component.scss']
})
export class CompterenduPrintComponent implements OnInit{
  personnel$:any;
  compteRendu$:any;
  idPersonnel:number;
  idUtilisateur:string;
  selectPersonnel:any;
  dateJour:Date;
  personnelSelectionnee:any;
  denomination:string;
  afficherTous:boolean;
  @Input() selectedItem: any;
  constructor(
    public compteRenduService: CompterenduService,
    public personnelService:PersonnelService) {}

  ngOnInit(): void {
    this.afficherPersonnel()
    // this.afficherRDV()
    this.selectPersonnel = document.getElementById("ComboPersonnelRendu");
    this.dateJour=new Date();
  }
  afficherCompteRendu()
  {
    this.denomination=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].text;
    if(this.denomination!="Tous"){
      this.afficherTous=false;
      this.personnelSelectionnee=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].value;

      this.idPersonnel=this.personnelSelectionnee;
      this.compteRenduService.afficherCompteRenduSelonUtilisateur(this.idPersonnel).subscribe(
        (data) => {
          this.compteRendu$=data;
        }
      );
    }
    else{
      this.afficherTous=true;
      // this.personnelSelectionnee=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].value;
      // this.idPersonnel=this.personnelSelectionnee;
      this.compteRenduService.afficherCompteRenduTous().subscribe(
        (data) => {
          this.compteRendu$=data;
        }
      );
    }

  }
  imprimer(){
    this.denomination=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].text;
    if(this.denomination!="Tous"){
      this.personnelSelectionnee=this.selectPersonnel.options[this.selectPersonnel.selectedIndex].value;

      this.idUtilisateur=this.personnelSelectionnee;
    }
    else
      this.idUtilisateur=null;

      this.compteRenduService.afficherEtat(this.idUtilisateur).subscribe(
        (data) => {
          // this.compteRendu$=data;
          console.log("pass" ,data)
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
      PDF.save('liste des comptes rendus.pdf');
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
        pdf.save('liste des comptes rendus.pdf');
        // window.open(
        //   pdf.output("bloburl", { filename: "dépôts-supérieur-à-cinq-millions.pdf" }),
        //   "_blank"
        // );
      }
    );
  }
}
