import {Component, Input} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {CategorieService} from "../../../services/categorie.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
    selector: 'app-delete-categorie-modal',
    templateUrl: './delete-categorie-modal.component.html',
    styleUrls: ['./delete-categorie-modal.component.scss'],
    standalone: false
})
export class DeleteCategorieModalComponent {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private categorieService: CategorieService,
              private router:Router,
              public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimerCategorie() {
    this.isLoading = true;
    const sb = this.categorieService.delete(this.id).pipe(
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
