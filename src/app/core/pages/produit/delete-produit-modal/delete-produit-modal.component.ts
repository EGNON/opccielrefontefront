import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {ProduitService} from "../../../../crm/services/produit.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-produit-modal',
  templateUrl: './delete-produit-modal.component.html',
  styleUrls: ['./delete-produit-modal.component.scss']
})
export class DeleteProduitModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private entityService: ProduitService,
              private router:Router,
              public modal: NgbActiveModal) { }

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
