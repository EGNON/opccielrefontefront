import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OrdreService} from "../../../services/ordre.service";
import {AuthService} from "../../../../core/modules/auth";
import {LocalService} from "../../../../services/local.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";

@Component({
    selector: 'app-impression-ordre',
    templateUrl: './impression-ordre.component.html',
    styleUrl: './impression-ordre.component.scss',
    standalone: false
})
export class ImpressionOrdreComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public seanceOpcvmSettings = {};
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  // idSeance:number;
  verifier:boolean;
  id:any[];
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  ordre$:any;
  idOpcvm:any;
  idSeance:any;
  idOrdreTab:any[]
  depotRachat2$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  numeroOrdre:any;
  private clickListener: () => void;
  private idInAction: number;
  entityForm: FormGroup;

  // @ts-ignore
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: OrdreService,
    public seanceOpcvmService: SeanceopcvmService,
    public authService: AuthService,
    public localStore: LocalService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.seanceOpcvmSettings = {
      singleSelection: true,
      idField: 'idSeance',
      textField: 'libelleSeance',
      enableCheckAll: false,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.afficherSeance()

    this.idOrdreTab=[]
  }
  afficherOrdreDeBourse(){
    this.entityService.impressionOrdre(this.idOpcvm,this.idSeance).subscribe(
      (data)=>{
        this.ordre$=data.data
        console.log(this.ordre$)
      }
    )
  }
  apercuOrdreDeBourse(){
    let i=0
    // for(i===0;i<this.idOrdreTab.length;i++){
    //   if(i===0)
    //     this.numeroOrdre=this.idOrdreTab[i]
    //   else
    //     this.numeroOrdre=this.numeroOrdre+";"+this.idOrdreTab[i]
    // }
    this.entityService.apercuOrdreDeBourse(this.idOrdreTab).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ordre_de_bourse.pdf';
        a.click();
      });
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    this.idSeance=item.idSeance
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    console.log(this.idSeance,this.idOpcvm)
    this.afficherOrdreDeBourse()
    // let isSelected=false;
    // isSelected=this.entityForm.get(formControlNameCkeck).value

    // this.idPersonneTab.push(item.idPersonne)
    //
    // console.log(this.idPersonneTab)

  }
  public onDeSelect(item: any) {
    this.idSeance=0
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    // this.afficherOrdreDeBourse()
    this.ordre$=null
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
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
  afficherSeance(){
    this.seanceOpcvmService.listeSeanceOpcvmDesc(this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.seance=data.data
      }
    )
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
