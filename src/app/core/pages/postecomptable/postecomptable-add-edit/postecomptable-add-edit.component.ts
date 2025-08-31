import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subject, Subscription} from "rxjs";
import {ResponseModel} from "../../../../crm/models/table.model";
import {SweetAlertOptions} from "sweetalert2";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {
  ComptecomptableAddEditComponent
} from "../../comptecomptable/comptecomptable-add-edit/comptecomptable-add-edit.component";
import {DeletePostecomptableModalComponent} from "../../postecomptable/delete-postecomptable-modal/delete-postecomptable-modal.component";
import {PostecomptableService} from "../../../services/postecomptable.service";
import {PlanService} from "../../../services/plan.service";
import {Config} from "datatables.net";

@Component({
    selector: 'app-postecomptable-add-edit',
    templateUrl: './postecomptable-add-edit.component.html',
    styleUrl: './postecomptable-add-edit.component.scss',
    standalone: false
})
export class PostecomptableAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  id2?: any;
  datatableConfig: Config = {};
  datatable: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  codePostecomptable:string;
  postecomptable$:any;
  categoriePersonne$:any;
  private clickListener: () => void;
  private idInAction: number;
  dtTrigger: Subject<any> = new Subject<any>();
  compteComptable$: Observable<ResponseModel<any>>;
  plan$: any;
  compteComptable: any[] = [];
  readOnly:boolean;
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  message:string;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  dtOptions: any = {};
  @Input() entity: any;
  @Input() entityF: any;
  @Input() isModal: boolean = false;
  estModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: PostecomptableService,
    private planService:PlanService,
    private cryptageService: CryptageService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.dateAlerte = new Date();

    this.id = this.route.snapshot.params['id'];
    this.id2 = this.route.snapshot.params['id2'];
    this.codePostecomptable=this.id

    this.entityForm = this.fb.group(
      {
        id: [null],
        libellePosteComptable: [null, Validators.required],
        codePosteComptable: [null, Validators.required],
        type: [null, Validators.required],
        formule: [null, Validators.required],
        plan: [null, Validators.required],
      }
    );
    this.readOnly=false
    this.afficherPlan();
    if (this.id) {
      this.readOnly=true;
      // console.log(this.id);
      this.pageInfo.updateTitle("Modification de poste comptable")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        {
          // console.log("entity==",entity.data);
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de poste comptable")
    }
  }
  loadFormValues(entity: any)
  {
    this.postecomptable$=entity;
    this.entity = entity;
    this.entityForm.patchValue({libellePosteComptable: entity.libellePosteComptable});
    this.entityForm.patchValue({codePosteComptable: entity.codePosteComptable});
    this.entityForm.patchValue({type: entity.type});
    this.entityForm.patchValue({formule: entity.formule});
    this.entityForm.patchValue({plan: entity.plan});
  }
  afficherPlan(){
    this.planService.afficherTous().subscribe(
      (data)=>{
        this.plan$=data.data;
      }
    )
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.entityForm.controls;
  }
  renderEmetteurColumn(): void {
    if (this.datatableConfig.columns) {
      let Emetteurs = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      Emetteurs.render = (data: any, type: any, full: any) => {
        const parentEmetteurStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.numCompteComptable}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.numCompteComptable}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.numCompteComptable}">Supprimer</a>
                </li>`;
        const parentEmetteurEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentEmetteurStart);
        // Emetteurs.push(show);
        actions.push(edit);
        //actions.push(separator);
        // actions.push(delete1);
        actions.push(parentEmetteurEnd);

        return actions.join('');
      }
    }
  }
  supprimer(id: any) {
    const modalRef = this.modalService.open(DeletePostecomptableModalComponent);
    modalRef.componentInstance.id = id;

    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    //this.renderEmetteurColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id} = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }
  onSaveEntity() {

    const sb = this.saveEntity().pipe(
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false
        this.router.navigate(['/app/standard/parametre/comptabilite/postecomptable']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const entity = {
      ...this.entityForm.value,
      // codeFormeJuridique: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    // console.log(entity);

    return this.id
      ? this.entityService.modifier(this.id2,this.id,entity)
      : this.entityService.create(entity);
  }
}

