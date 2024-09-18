import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePDF() {
    const pdf = new jspdf.jsPDF('p', 'pt', 'letter');

    const options = {
      pagesplit: true // Activer la pagination
    };

    // @ts-ignore
    const content: HTMLElement = document.getElementById('print-section'); // Remplacez 'tableContent' par l'ID de votre tableau

    // @ts-ignore
    html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const imgWidth = 612; // Largeur d'une page au format 'letter'
      const pageHeight = 792; // Hauteur d'une page au format 'letter'
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('tableau.pdf');
    });
  }
}
