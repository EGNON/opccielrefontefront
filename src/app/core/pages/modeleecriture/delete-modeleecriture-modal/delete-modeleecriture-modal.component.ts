import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {ModeleecritureService} from "../../../services/modeleecriture.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {ModeleecriturenatureoperationService} from "../../../services/modeleecriturenatureoperation.service";
import {DetailmodeleService} from "../../../services/detailmodele.service";

@Component({
    selector: 'app-delete-modeleecriture-modal',
    templateUrl: './delete-modeleecriture-modal.component.html',
    styleUrl: './delete-modeleecriture-modal.component.scss',
    standalone: false
})
export class DeleteModeleecritureModalComponent implements OnInit{
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: ModeleecriturenatureoperationService,
    private detailModeleService: DetailmodeleService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
    this.isLoading = true;
    console.log(this.id)
    //this.entityService.getById(this.id).subscribe(
    //  (data)=>{
        // console.log("code===",data.data.modeleEcriture.codeModeleEcriture)
        this.detailModeleService.supprimerSelonModeleEcriture
        (this.id.split('/')[0].trim()).subscribe()
     // }
    //)
    const sb = this.entityService.supprier(this.id.split('/')[0],
      this.id.split('/')[1],this.id.split('/')[2]).pipe(
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

