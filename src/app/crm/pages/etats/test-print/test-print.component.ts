import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {CompterenduService} from "../../../services/compterendu.service";
import {filter} from "rxjs/operators";
import {Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {Config} from "datatables.net";

@Component({
    selector: 'app-test-print',
    templateUrl: './test-print.component.html',
    styleUrls: ['./test-print.component.scss'],
    standalone: false
})
export class TestPrintComponent implements OnInit, OnDestroy, AfterViewInit{

  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(private crService: CompterenduService) {}

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.crService.afficherTous(dataTablesParameters)
          .pipe(
            filter((resp) => resp.data.length > 0),
          )
          .subscribe(resp => {
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [

      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngAfterViewInit(): void {
  }

  openPDF(){
    let DATA = document.getElementById('reporting');
    html2canvas(DATA!).then((canvas) => {
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
