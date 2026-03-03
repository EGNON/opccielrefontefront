import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, delay, tap, catchError, of, finalize } from 'rxjs';
import { NatureoperationService } from '../../../services/natureoperation.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { AuthService } from '../../../modules/auth';

@Component({
  selector: 'app-deleteparametrejoursferiesmodal',
  standalone: false,
  templateUrl: './deleteparametrejoursferiesmodal.html',
  styleUrl: './deleteparametrejoursferiesmodal.scss'
})
export class Deleteparametrejoursferiesmodal implements OnInit{
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: LibrairiesService,
    private router:Router,
    private authService:AuthService,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
    this.isLoading = true;
    console.log(this.id)
    const sb = this.entityService.supprimerJoursFeries(this.authService.currentUserValue.username
      ,this.id).pipe(
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
