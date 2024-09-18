import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {ModeleecritureService} from "../../../../core/services/modeleecriture.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {IbrubriquepositionService} from "../../../../core/services/ibrubriqueposition.service";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";

@Component({
  selector: 'app-delete-actionnaireopcvm-modal',
  templateUrl: './delete-actionnaireopcvm-modal.component.html',
  styleUrl: './delete-actionnaireopcvm-modal.component.scss'
})
export class DeleteActionnaireopcvmModalComponent implements OnInit{
  @Input() id: string;
  id2:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: ActionnaireopcvmService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
    this.isLoading = true;
    this.id2=String(this.id)
    // console.log("codeIB=",this.id.split('/')[0])
    // console.log("codeRubrique=",this.id.split('/')[1])
    // console.log("codePosition=",this.id.split('/')[2])
    const sb = this.entityService.supprimer(this.id.split('/')[0],
      this.id.split('/')[1]).pipe(
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

