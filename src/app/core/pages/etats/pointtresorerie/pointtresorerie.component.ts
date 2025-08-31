import {Component, OnInit} from '@angular/core';
import {LibrairiesService} from "../../../../services/librairies.service";
import {
  DeleteModalOperationdetachementComponent
} from "../../../../opcvm/pages/operationdetachement/delete-modal-operationdetachement/delete-modal-operationdetachement.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PointtresorerieetatComponent} from "../pointtresorerieetat/pointtresorerieetat.component";

@Component({
    selector: 'app-pointtresorerie',
    templateUrl: './pointtresorerie.component.html',
    styleUrl: './pointtresorerie.component.scss',
    standalone: false
})
export class PointtresorerieComponent implements OnInit{
  constructor(
    public  librairiesServie:LibrairiesService,
    private modalService: NgbModal
    )
  {}
  ngOnInit(): void {
    const modalRef = this.modalService.open(PointtresorerieetatComponent);
  }

}
