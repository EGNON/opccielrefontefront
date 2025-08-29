import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LibrairiesService} from "../../../../services/librairies.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-procedurecomptable',
  templateUrl: './procedurecomptable.component.html',
  styleUrl: './procedurecomptable.component.scss'
})
export class ProcedurecomptableComponent implements OnInit{
  downloading:boolean;
  constructor(public modal: NgbActiveModal,
              public  librairiesServie:LibrairiesService) {
  }
  ngOnInit(): void {
  }
  telecharger(){
    this.downloading=true
    // let beginEndDate={
    //   startDate:new Date(),
    //   endDate:new Date()
    // }
    this.librairiesServie.procedureComptable().pipe(
      finalize(() => {
        this.downloading = false;
      })
    ).subscribe()
  }

}
