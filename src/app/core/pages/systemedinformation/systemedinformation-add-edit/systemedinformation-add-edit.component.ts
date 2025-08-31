import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {FormejuridiqueService} from "../../../../crm/services/formejuridique.service";
import {CategorieService} from "../../../../crm/services/categorie.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {SystemedinformationService} from "../../../../crm/services/systemedinformation.service";

@Component({
    selector: 'app-systemedinformation-add-edit',
    templateUrl: './systemedinformation-add-edit.component.html',
    styleUrl: './systemedinformation-add-edit.component.scss',
    standalone: false
})
export class SystemedinformationAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  categoriePersonne$:any;
  message:string;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @Input() entity: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: SystemedinformationService,
    private categorieService: CategorieService,
    private cryptageService: CryptageService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dateAlerte = new Date();

    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [null],
        logiciel: [null, Validators.required],
        dateAcquisition: [null, Validators.required],
        dateInfoCREPMF: [null, Validators.required],
        denomination: [null, Validators.required],
        dateDebutMaintenance: [null, Validators.required],
        dateFinMaintenance: [null, Validators.required],
        principalFonctionnalite: [null, Validators.required],
      }
    );
    // this.afficherCategorie();
    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de système d'information")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de système d'information")
    }
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({logiciel: entity.logiciel});
    let dateAcquisition = new Date(entity.dateAcquisition);
    this.entityForm.patchValue({dateAcquisition: new NgbDate(
        dateAcquisition.getFullYear(), dateAcquisition.getMonth()+1, dateAcquisition.getDate())});
    let dateInfoCREPMF = new Date(entity.dateInfoCREPMF);
    this.entityForm.patchValue({dateInfoCREPMF: new NgbDate(
        dateInfoCREPMF.getFullYear(), dateInfoCREPMF.getMonth()+1, dateInfoCREPMF.getDate())});
    this.entityForm.patchValue({denomination: entity.denomination});
    let dateDebutMaintenance = new Date(entity.dateDebutMaintenance);
    this.entityForm.patchValue({dateDebutMaintenance: new NgbDate(
        dateDebutMaintenance.getFullYear(), dateDebutMaintenance.getMonth()+1, dateDebutMaintenance.getDate())});
    let dateFinMaintenance = new Date(entity.dateFinMaintenance);
    this.entityForm.patchValue({dateFinMaintenance: new NgbDate(
        dateFinMaintenance.getFullYear(), dateFinMaintenance.getMonth()+1, dateFinMaintenance.getDate())});
    this.entityForm.patchValue({principalFonctionnalite: entity.principalFonctionnalite});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.entityForm.controls;
  }
  onSaveEntity() {
    const sb = this.saveEntity().pipe(
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/systemedinformation']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let dateAcquisition: any;
    if(this.entityForm.controls.dateAcquisition.value)
    {
      dateAcquisition = new Date(
        this.entityForm.controls.dateAcquisition.value.year,
        this.entityForm.controls.dateAcquisition.value.month-1,
        this.entityForm.controls.dateAcquisition.value.day+1);
    }
    let dateInfoCREPMF: any;
    if(this.entityForm.controls.dateInfoCREPMF.value)
    {
      dateInfoCREPMF = new Date(
        this.entityForm.controls.dateInfoCREPMF.value.year,
        this.entityForm.controls.dateInfoCREPMF.value.month-1,
        this.entityForm.controls.dateInfoCREPMF.value.day+1);
    }
    let dateDebutMaintenance: any;
    if(this.entityForm.controls.dateDebutMaintenance.value)
    {
      dateDebutMaintenance = new Date(
        this.entityForm.controls.dateDebutMaintenance.value.year,
        this.entityForm.controls.dateDebutMaintenance.value.month-1,
        this.entityForm.controls.dateDebutMaintenance.value.day+1);
    }
    let dateFinMaintenance: any;
    if(this.entityForm.controls.dateFinMaintenance.value)
    {
      dateFinMaintenance = new Date(
        this.entityForm.controls.dateFinMaintenance.value.year,
        this.entityForm.controls.dateFinMaintenance.value.month-1,
        this.entityForm.controls.dateFinMaintenance.value.day+1);
    }
    const entity = {
      ...this.entityForm.value,
      // codeFormeJuridique: this.id ? this.id : null,
      id: this.id ? this.id : null,
      dateFinMaintenance:dateFinMaintenance,
      dateDebutMaintenance:dateDebutMaintenance,
      dateInfoCREPMF:dateInfoCREPMF,
      dateAcquisition:dateAcquisition
    };
    console.log(entity)

    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}
