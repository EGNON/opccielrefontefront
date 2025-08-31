import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {TarificationordinaireService} from "../../../services/tarificationordinaire.service";

@Component({
    selector: 'app-delete-tarificationordinaire-modal',
    templateUrl: './delete-tarificationordinaire-modal.component.html',
    styleUrl: './delete-tarificationordinaire-modal.component.scss',
    standalone: false
})
export class DeleteTarificationordinaireModalComponent implements OnInit{
  @Input() id: any;
  id2:number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: TarificationordinaireService,
    private detailProfilService: DetailprofilService,
    private router:Router,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  supprimer() {
    this.isLoading = true;

    // console.log("codeIB=",this.id.split('/')[0])
    // console.log("codeRubrique=",this.id.split('/')[1])
    // console.log("codePosition=",this.id.split('/')[2])

    console.log("id=",this.id)
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

