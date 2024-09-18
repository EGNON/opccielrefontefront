import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {CompterenduService} from "../../../services/compterendu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-compterendu-modal',
  templateUrl: './delete-compterendu-modal.component.html',
  styleUrls: ['./delete-compterendu-modal.component.scss']
})
export class DeleteCompterenduModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: CompterenduService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteEntity() {
    this.isLoading = true;
    const sb = this.entityService.deleteRow(this.id).pipe(
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
