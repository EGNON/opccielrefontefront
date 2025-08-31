import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {Qualite} from "../../../../crm/models/qualite.model";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {DegreService} from "../../../../crm/services/degre.service";
import {CritereAlerteService} from "../../../services/criterealerte.service";

@Component({
    selector: 'app-delete-criterealerte-modal',
    templateUrl: './delete-criterealerte-modal.component.html',
    styleUrl: './delete-criterealerte-modal.component.scss',
    standalone: false
})
export class DeleteCriterealerteModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: CritereAlerteService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimerCritereAlerte() {
    this.isLoading = true;
    const sb = this.entityService.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
