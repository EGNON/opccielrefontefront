import {Component, Input, OnInit} from '@angular/core';
import {of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {NgIf} from "@angular/common";
import {Qualite} from "../../../../crm/models/qualite.model";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-personne-morale-juge-modal',
  templateUrl: './delete-personne-morale-juge-modal.component.html',
  styleUrl: './delete-personne-morale-juge-modal.component.scss'
})
export class DeletePersonneMoraleJugeModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  qualite:Qualite;
  constructor(
    private entityService: PersonneMoraleService,
    private qualiteService: QualiteService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteEntity() {
    this.isLoading = true;
    this.qualiteService.afficherSelonLibelle("juge").subscribe(
      (data)=>{
        this.qualite=data;
        const sb = this.entityService.deleteByPersonneAndQualite(this.id,this.qualite.idQualite).pipe(
          tap(() => this.modal.close()),
          catchError((err) => {
            this.modal.dismiss(err);
            return of(undefined);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe(
          {
          next: (value) => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
            });
          },
          error: err => {

          }
        });
        this.subscriptions.push(sb);
      }
    )

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}



