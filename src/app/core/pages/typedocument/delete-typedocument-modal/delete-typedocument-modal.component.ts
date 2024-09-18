import {Component, Input} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-typedocument-modal',
  templateUrl: './delete-typedocument-modal.component.html',
  styleUrls: ['./delete-typedocument-modal.component.scss']
})
export class DeleteTypedocumentModalComponent {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private typeDocumentService: TypeDocumentService,
              private router:Router,
              public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimerEntity() {
    this.isLoading = true;
    const sb = this.typeDocumentService.deleteRow(this.id).pipe(
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
