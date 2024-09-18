import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {SoustypeactionService} from "../../../services/soustypeaction.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {TypeactionService} from "../../../services/typeaction.service";

@Component({
  selector: 'app-delete-typeaction-modal',
  templateUrl: './delete-typeaction-modal.component.html',
  styleUrl: './delete-typeaction-modal.component.scss'
})
export class DeleteTypeactionModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: TypeactionService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
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

