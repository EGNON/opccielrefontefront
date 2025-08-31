import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DepotrachatService} from "../../../services/depotrachat.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {LocalService} from "../../../../services/local.service";
import {NgbActiveModal, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OrdreService} from "../../../services/ordre.service";

@Component({
    selector: 'app-validation-ordre',
    templateUrl: './validation-ordre.component.html',
    styleUrl: './validation-ordre.component.scss',
    standalone: false
})
export class ValidationOrdreComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  verifier:boolean;
  id:any[];
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  ordre$:any;
  idOrdreTab:any[]
  depotRachat2$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  private clickListener: () => void;
  private idInAction: number;
  entityForm: FormGroup;

  // @ts-ignore
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: OrdreService,
    public authService: AuthService,
    public localStore: LocalService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.entityService.afficherListe(this.localStore.getData("currentOpcvm").idOpcvm).subscribe(
      (data)=>{
        this.ordre$=data.data
      }
    )
    this.idOrdreTab=[]
  }
  getIdOrdre(idOrdre:any){
    let index=this.idOrdreTab.indexOf(idOrdre)

      if(index!==-1)
        this.idOrdreTab.splice(index,1)
      else
        this.idOrdreTab.push(idOrdre)
    console.log(this.idOrdreTab)
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
  valider(){
    if(this.idOrdreTab.length===0)
    {
      alert("Veuillez cocher les ordres à valider")
      return
    }

    this.entityService.validation(this.idOrdreTab,this.authService.currentUserValue?.username).subscribe(
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
    )
  }
  protected readonly getComputedStyle = getComputedStyle;
}

