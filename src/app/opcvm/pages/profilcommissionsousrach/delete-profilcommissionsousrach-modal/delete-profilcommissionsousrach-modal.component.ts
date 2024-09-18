import {Component, Input, OnInit} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {ActionnairecommissionService} from "../../../services/actionnairecommission.service";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {DetailprofilService} from "../../../services/detailprofil.service";

@Component({
  selector: 'app-delete-profilcommissionsousrach-modal',
  templateUrl: './delete-profilcommissionsousrach-modal.component.html',
  styleUrl: './delete-profilcommissionsousrach-modal.component.scss'
})
export class DeleteProfilcommissionsousrachModalComponent implements OnInit{
  @Input() id: string;
  id2:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: ProfilcommissionsousrachService,
    private detailProfilService: DetailprofilService,
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
    this.detailProfilService.supprimer(this.id.split('/')[0],
      this.id.split('/')[1]).subscribe();

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

