import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbActiveModal, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'datatables.net';
import {catchError, finalize, of, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { AuthService } from '../../../../core/modules/auth';
import { DepotrachatService } from '../../../services/depotrachat.service';
import { SeanceopcvmService } from '../../../services/seanceopcvm.service';
import {LocalService} from "../../../../services/local.service";

@Component({
    selector: 'app-verifintentionrachat',
    templateUrl: './verifintentionrachat.component.html',
    styleUrl: './verifintentionrachat.component.scss',
    standalone: false
})
export class VerifintentionrachatComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  verifier:boolean;
  id:any[];
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  depotRachat$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  private clickListener: () => void;
  private idInAction: number;
  entityForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: DepotrachatService,
    public seanceOpcvmService: SeanceopcvmService,
    public authService: AuthService,
    public localStore: LocalService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        denominationOpcvm: [null],
        idSeance: [null],
        dateOuverture: [null],
        dateFermeture: [null],
      }
    );
    // console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    // console.log("idOpcvm=",this.localStore.getData("currentOpcvm").idOpcvm)
    this.seanceOpcvmService.afficherSeanceEnCours(this.localStore.getData("currentOpcvm").idOpcvm)
      .subscribe(
        (data)=>{
          this.seance=data.data;
          this.entityForm.patchValue({denominationOpcvm:this.seance.opcvm?.denominationOpcvm})
          this.entityForm.patchValue({idSeance:this.seance.idSeanceOpcvm.idSeance})
          let dateOuverture = new Date(this.seance.dateOuverture);
          this.entityForm.patchValue({dateOuverture: new NgbDate(
              dateOuverture.getFullYear(), dateOuverture.getMonth()+1, dateOuverture.getDate())});

          let dateFermeture = new Date(this.seance.dateFermeture);
          this.entityForm.patchValue({dateFermeture: new NgbDate(
              dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});
          this.afficherVerificationIntentionRachat()
        }
      )

  }
  afficherVerificationIntentionRachat()
  {
    this.entityService.afficherFT_DepotRachat(
      this.localStore.getData("currentOpcvm").idOpcvm,false,false).subscribe(
      (data)=>{
        this.depotRachat$=data;
        console.log("depotRachat=",this.depotRachat$)
        let i=0;
        let j=0;
        for(i===0;i<this.depotRachat$.length;i++){
          console.log(this.depotRachat$[i].estVerifier)
          if(this.depotRachat$[i].estVerifier)
          {
            j+=1;
          }
        }
        // console.log(j)
        // console.log(this.depotRachat$.length)
        if(j===this.depotRachat$.length)
          this.verifier=true;
        else
          this.verifier=false;
        // console.log(this.verifier)
      }
    )
  }
  verifiIntentionRachat()
  {
    this.entityService.verifIntentionRachat(
      this.localStore.getData("currentOpcvm").idOpcvm,false,false).subscribe(
      (data)=>{
        // console.log(data)
      }
    )
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderActionColumn(): void {
    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      actions.render = (data: any, type: any, full: any) => {
        const parentActionStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idDepotRachat}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idDepotRachat}"
                    data-id2="${full.idSeance}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idDepotRachat}"
                    >Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }
  validerRachat(){
    this.entityService.afficherFT_DepotRachat(
      this.localStore.getData("currentOpcvm").idOpcvm,false,false).subscribe(
      (data)=>{
        this.depotRachat$=data;
        let i=0;
        this.id=[];
        //console.log(this.depotRachat$)
        for(i===0;i<this.depotRachat$.length;i++){
          this.id.push(this.depotRachat$[i].idDepotRachat)
        }
        //console.log(this.id)
        this.entityService.modifier(this.id,this.authService.currentUserValue?.username)
          .subscribe(
            {
              next: (value) => {
                // let currentUrl = this.router.url;
                // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                //   this.router.navigate([currentUrl]);
                // });
                this.verifier=true
              },
              error: err => {

              }
            }
          )

        // this.afficherVerificationIntentionRachat()
      }
    )
  }
}
