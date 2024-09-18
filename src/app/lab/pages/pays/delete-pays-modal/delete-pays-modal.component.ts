import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {PaysService} from "../../../../crm/services/pays.service";

@Component({
  selector: 'lab-delete-pays-modal',
  templateUrl: './delete-pays-modal.component.html',
  styleUrls: ['./delete-pays-modal.component.scss']
})
export class DeletePaysModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private entityService: PaysService, public modal: NgbActiveModal) { }

  ngOnInit(): void {}

  supprimerEntity() {
    this.isLoading = true;
    const sb = this.entityService.deleteRow(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
