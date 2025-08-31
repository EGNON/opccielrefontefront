import {Component, Input} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {MonnaieService} from "../../../../crm/services/monnaie.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-delete-monnaie-modal',
    templateUrl: './delete-monnaie-modal.component.html',
    styleUrls: ['./delete-monnaie-modal.component.scss'],
    standalone: false
})
export class DeleteMonnaieModalComponent {
  @Input() id: any;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private monnaieService: MonnaieService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimerEntity() {
    this.isLoading = true;
    const sb = this.monnaieService.delete(this.id).pipe(
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
