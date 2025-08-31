import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {OperationdetachementService} from "../../../services/operationdetachement.service";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {OperationevenementsurvaleurService} from "../../../services/operationevenementsurvaleur.service";

@Component({
    selector: 'app-delete-modal-operationevenementsurvaleur',
    templateUrl: './delete-modal-operationevenementsurvaleur.component.html',
    styleUrl: './delete-modal-operationevenementsurvaleur.component.scss',
    standalone: false
})
export class DeleteModalOperationevenementsurvaleurComponent implements OnInit{
  @Input() id: string;
  id2:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: OperationevenementsurvaleurService,
    private detailProfilService: DetailprofilService,
    private router:Router,
    public authService: AuthService,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
    this.isLoading = true;
    console.log(this.id)
    const sb = this.entityService.supprimer(this.authService.currentUserValue?.username,
      this.id).pipe(
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

