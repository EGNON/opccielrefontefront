import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OperationService} from "../../../../services/operation.service";

@Component({
    selector: 'app-details-ecriture',
    templateUrl: './details-ecriture.component.html',
    styleUrl: './details-ecriture.component.scss',
    standalone: false
})
export class DetailsEcritureComponent implements OnInit{
  @Input() idOperation: number = 0;
  @Input() details: any = [];
  @ViewChild('detail', { static: false }) detail: ElementRef;
  total: string = "TOTAL";

  [key: string]: any;

  constructor(private opService: OperationService) {
  }

  afficherDetails(idOperation: number = 0) {
    this["details$"] = this.opService.afficherDetailsEcriture(idOperation);
  }

  ngOnInit(): void {
    // this.afficherDetails(this.idOperation);
  }
}
