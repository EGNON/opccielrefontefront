import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {PaysService} from "../../../../crm/services/pays.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";

@Component({
    selector: 'app-delete-depotsouscription-modal',
    templateUrl: './delete-depotsouscription-modal.component.html',
    styleUrl: './delete-depotsouscription-modal.component.scss',
    standalone: false
})
export class DeleteDepotsouscriptionModalComponent implements OnInit, OnDestroy{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private entityService: DepotsouscriptionService,
              private router:Router,
              public modal: NgbActiveModal) { }

  ngOnInit(): void {}

  supprimerEntity() {
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
