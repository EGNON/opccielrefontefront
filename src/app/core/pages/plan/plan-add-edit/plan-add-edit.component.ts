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
import {SweetAlertOptions} from "sweetalert2";
import {Observable, of, Subject, Subscription, tap} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PlanService} from "../../../services/plan.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import $ from "jquery";
import moment from "moment";
import {DeletePlanModalComponent} from "../delete-plan-modal/delete-plan-modal.component";
import {DegreAddEditComponent} from "../../degre/degre-add-edit/degre-add-edit.component";
import {CompteAddEditComponent} from "../compte-add-edit/compte-add-edit.component";
import {ResponseModel} from "../../../../crm/models/table.model";
import {
  ComptecomptableAddEditComponent
} from "../../comptecomptable/comptecomptable-add-edit/comptecomptable-add-edit.component";
import {Plan} from "../../../models/plan.model";
import {Config} from "datatables.net";

@Component({
    selector: 'app-plan-add-edit',
    templateUrl: './plan-add-edit.component.html',
    styleUrl: './plan-add-edit.component.scss',
    standalone: false
})
export class PlanAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  datatableConfig: Config = {};
  datatable: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  codePlan:string;
  plan$:any;
  categoriePersonne$:any;
  private clickListener: () => void;
  private idInAction: number;
  dtTrigger: Subject<any> = new Subject<any>();
  compteComptable$: Observable<ResponseModel<any>>;
  compteComptableList$: any;
  compteComptable: any[] = [];

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
    private entityService: PlanService,
    private compteComptableService:ComptecomptableService,
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
    this.codePlan=this.id

    this.entityForm = this.fb.group(
      {
        id: [null],
        libellePlan: [null, Validators.required],
        codePlan: [null, Validators.required],
        numCompteCapital: [null, Validators.required],
        numCompteBenefice: [null, Validators.required],
        numComptePerte: [null, Validators.required],
        numCompteResInsDistribution: [null, Validators.required],
        compteComptable: [null],
      }
    );
    // this.afficherCategorie();
    if (this.id) {
      // console.log(this.id);
      this.dtOptions = {...this.compteComptableService.dtOptions};
      this.afficherCompteComptableListe()
      this.pageInfo.updateTitle("Modification de plan")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de plan")
    }
  }
  loadFormValues(entity: any)
  {
    this.plan$=entity;
    this.entity = entity;
    this.entityForm.patchValue({libellePlan: entity.libellePlan});
    this.entityForm.patchValue({codePlan: entity.codePlan});
    this.entityForm.patchValue({numCompteCapital: entity.numCompteCapital});
    this.entityForm.patchValue({numCompteBenefice: entity.numCompteBenefice});
    this.entityForm.patchValue({numComptePerte: entity.numComptePerte});
    this.entityForm.patchValue({numCompteResInsDistribution: entity.numCompteResInsDistribution});
  }
  afficherCompteComptableListe(){
    this.compteComptableService.afficherSelonPlanListe(this.id).subscribe(
      (data)=>{
        this.compteComptableList$=data.data;
      }
    )
  }
  afficherCompteComptable()
  {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.compteComptableService.afficherSelonPlan(dataTablesParameters,this.id)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Num', data: 'numCompteComptable', render: function (data, type, row) {
            return row.numCompteComptable;
          }
        },
        {
          title: 'Libellé', data: 'libelleCompteComptable', render: function (data, type, row) {
            return row.libelleCompteComptable;
          }
        },
        {
          title: 'Sens', data: 'sensMvt', render: function (data, type, row) {
            return row.sensMvt;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
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
  callCompteForm(entity: any,estModal:boolean) {
    this.estModal=estModal;
    const modalRef = this.modalService.open(ComptecomptableAddEditComponent, {
      backdrop: "static",
      size: "xs"
    });
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.estModal = true;
    modalRef.componentInstance.codePlan = this.codePlan;
    modalRef.componentInstance.plan = this.plan$;
    console.log("this.plan=",this.plan$)
    if(entity)
    {
      modalRef.componentInstance.entity = entity;
      modalRef.componentInstance.id = entity.numCompteComptable;
    }

    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      this.compteComptableList$.push(receivedEntry);
      this.entityForm.patchValue({compteComptable: this.compteComptableList$.find((o:any) => o.numCompteComptable == receivedEntry.numCompteComptable)});
    });
  }

  supprimer(id: any) {
    const modalRef = this.modalService.open(DeletePlanModalComponent);
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
            //this.callCompteForm(id,true)
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
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/plan']);
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
    console.log(entity)

    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}
