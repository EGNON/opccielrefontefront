import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {CompartimentService} from "../../../services/compartiment.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {ComptecomptableService} from "../../../services/comptecomptable.service";

@Component({
  selector: 'app-delete-comptecomptable-modal',
  templateUrl: './delete-comptecomptable-modal.component.html',
  styleUrl: './delete-comptecomptable-modal.component.scss'
})
export class DeleteComptecomptableModalComponent implements OnInit{
  @Input() id: string;
  id2:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: ComptecomptableService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
    this.isLoading = true;
    this.id2=String(this.id)
    console.log("num=",this.id.split('/')[0])
    console.log("codeplan=",this.id.split('/')[1])
    const sb = this.entityService.supprimer(this.id.split('/')[1],this.id.split('/')[0]).pipe(
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

