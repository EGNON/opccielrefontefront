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
  styleUrl: './delete-modeleecriture-modal.component.scss'
})
export class DeleteModeleecritureModalComponent implements OnInit{
  @Input() id: number;
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
    // console.log(this.id)
    this.entityService.getById(this.id).subscribe(
      (data)=>{
        // console.log("code===",data.data.modeleEcriture.codeModeleEcriture)
        this.detailModeleService.supprimerSelonModeleEcriture
        (data.data.modeleEcriture.codeModeleEcriture.trim()).subscribe()
      }
    )
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

