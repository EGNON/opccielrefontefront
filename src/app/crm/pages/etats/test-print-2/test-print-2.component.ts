import {Component, ElementRef} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";

@Component({
  selector: 'app-test-print-2',
  templateUrl: './test-print-2.component.html',
  styleUrls: ['./test-print-2.component.scss']
})
export class TestPrint2Component {
    constructor(private el: ElementRef) {

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

  public openPDF(): void {
    let DATA: any = document.getElementById('reporting');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }
}
