import {Component, Input, OnInit} from '@angular/core';
import {of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {NgIf} from "@angular/common";
import {Qualite} from "../../../../crm/models/qualite.model";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-delete-personne-physique-modale',
    templateUrl: './delete-personne-physique-modale.component.html',
    styleUrl: './delete-personne-physique-modale.component.scss',
    standalone: false
})
export class DeletePersonnePhysiqueModaleComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  qualite:Qualite;
  constructor(
    private entityService: PersonnePhysiqueService,
    private qualiteService: QualiteService,
    private router: Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteEntity() {
    this.isLoading = true;
    this.qualiteService.afficherSelonLibelle("expose").subscribe(
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
          }
        );
        this.subscriptions.push(sb);
      }
    )

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

