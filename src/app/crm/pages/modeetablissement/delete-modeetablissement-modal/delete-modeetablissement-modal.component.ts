import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {delay, of, Subscription, tap} from "rxjs";
import {IndicateurService} from "../../../services/indicateur.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {ModeetablissementService} from "../../../services/modeetablissement.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-modeetablissement-modal',
  templateUrl: './delete-modeetablissement-modal.component.html',
  styleUrl: './delete-modeetablissement-modal.component.scss'
})
export class DeleteModeetablissementModalComponent implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private entityService: ModeetablissementService,
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
