import {Component, ElementRef, ViewChild} from '@angular/core';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//declare module 'html2pdf.js';
import * as html2pdf from "html2pdf.js";
import autoTable from "jspdf-autotable";

@Component({
    selector: 'app-print-secteur',
    templateUrl: './print-secteur.component.html',
    styleUrl: './print-secteur.component.scss',
    standalone: false
})
export class PrintSecteurComponent {
  @ViewChild("report", {static: false}) el: ElementRef;
  reportWith: number = 0;
  reportHeight: number = 0;

  getSize(reportSize: any) {
    this.reportWith = reportSize.width;
    this.reportHeight = reportSize.height;
    console.log("SIZE === ", reportSize);
  }

  exportPDF(div: any, fileName: any) {
    let report: any = document.getElementById(div == null ? "generalDiv" : div);
    /*invoice.style.width =  $(window).width()+"px";*/
    report.style.width =  this.reportWith+"px";
    console.log("WINDOWS WIDTH === ", this.reportWith);
    console.log("ELEMENT WIDTH === ", report);
    var opt = {
      margin: 1,
      filename: fileName+'.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1, width: this.reportWith},
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().from(report).set(opt).save();
  }

  async makePDF() {
    let DATA: any = document.getElementById('report');
    /*let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.html(DATA, {
      callback: (pdf) => {
        pdf.save("demo.pdf");
      },
      x: 265,
      y: 130
    });*/


    let doc_width = 29.7;  // A4 measures 210 × 297 millimeters or 8.27 × 11.69 inches
    let doc_height = 21;
    let aspect = doc_height / doc_width;
    let dpi = 120; // targeting ~1200 window width
    let img_width = doc_width * dpi;
    let img_height = doc_height * dpi;
    let win_width = img_width;
    let win_height = img_height;

    // https://html2canvas.hertzen.com/configuration
    let html2canvasOpts = {
      scale: img_width / win_width,   // equals 1
      width: img_width,
      height: img_height,
      windowWidth: win_width,
      windowHeight: win_height,
    };

    // https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html
    let jsPDFOpts: any = {
      orientation: "l",
      unit: 'cm',
      format: [doc_width, doc_height]
    };

    /*// https://github.com/eKoopmans/html2pdf
    html2pdf().set({
      margin:       [0.01, 0.01, 0.01, 0.01],
      filename:     'html2pdf.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  html2canvasOpts,
      jsPDF:        jsPDFOpts,
    }).from(DATA).save();*/


    let canvas = await html2canvas(DATA, html2canvasOpts);
    var img = canvas.toDataURL("image/jpeg");
    var pdf = new jsPDF(jsPDFOpts);
    pdf.addImage(img, 'JPG', 0, 0, doc_width, doc_height); // no idea why the extra .16 is needed...
    pdf.save('jsPDF.pdf');
  }

  openPDF(): void {
    let DATA: any = document.getElementById('report');
    html2canvas(DATA).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'in', 'a4');
      let width = pdf.internal.pageSize.getWidth();
      let height = canvas.height * width / canvas.width;
      console.log("AAAAAA === ", height);
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save('angular-demo.pdf');
    });
  }

  pdf() {
    const element = document.querySelector('#report');//id of HTML element
    const options = {
      filename: 'my-document.pdf',
      margin: 0,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'l' },
    };
    html2pdf().set(options).from(element).save();
  }

  generatePdf() {
    const doc = new jsPDF();

    autoTable(doc, {
      body: [
        [
          {
            content: "LOGO",
            styles: {
              halign: "left",
              valign: "middle",
              fontSize: 10,
              textColor: '#49bbf1'
            }
          },
          {
            content: ["SAPHIR ASSET MANAGEMENT"],
            styles: {
              halign: "center",
              fontSize: 18,
              textColor: '#49bbf1'
            }
          },
          {
            content: ["Société de Gestion d'Actifs"],
            styles: {
              halign: "center",
              fontSize: 10,
              textColor: '#111111'
            }
          }
        ]
      ]
    });

    //autoTable(doc, { html: '#report' });

    doc.save('secteurs.pdf');
  }
}
