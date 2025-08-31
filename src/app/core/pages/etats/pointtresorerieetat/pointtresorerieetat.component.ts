import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LibrairiesService} from "../../../../services/librairies.service";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-pointtresorerieetat',
    templateUrl: './pointtresorerieetat.component.html',
    styleUrl: './pointtresorerieetat.component.scss',
    standalone: false
})
export class PointtresorerieetatComponent implements OnInit{
  downloading:boolean;
  constructor(public modal: NgbActiveModal,
              public  librairiesServie:LibrairiesService) {
  }
  ngOnInit(): void {
  }
  telecharger(){
    this.downloading=true
    let beginEndDate={
      startDate:new Date(),
      endDate:new Date()
    }
    this.librairiesServie.pointTresorerie(beginEndDate).pipe(
      finalize(() => {
        this.downloading = false;
      })
    ).subscribe()
  }

}
