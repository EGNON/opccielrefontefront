import {Component, Input} from '@angular/core';
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {RdvService} from "../../../services/rdv.service";
import {AgentConcerneService} from "../../../services/agentconcerne.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-rdv-modal',
  templateUrl: './delete-rdv-modal.component.html',
  styleUrls: ['./delete-rdv-modal.component.scss']
})
export class DeleteRdvModalComponent {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private rdvService: RdvService,
              private agentConcerneService: AgentConcerneService,
              public modal: NgbActiveModal,
              private router: Router,) { }

  ngOnInit(): void {
  }

  supprimerEntity() {
    this.isLoading = true;
    // this.agentConcerneService.supprimerAgentConcerne(this.id).subscribe();
    const sb = this.rdvService.deleteRow(this.id).pipe(
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
    // this.router.navigate(['/crm/rendezvous/rdv']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
