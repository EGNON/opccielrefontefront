import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NatureoperationService} from "../../../services/natureoperation.service";
import {PlanService} from "../../../services/plan.service";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {JournalService} from "../../../services/journal.service";
import {TypeoperationService} from "../../../services/typeoperation.service";

@Component({
  selector: 'app-natureoperation-add-edit',
  templateUrl: './natureoperation-add-edit.component.html',
  styleUrl: './natureoperation-add-edit.component.scss'
})
export class NatureoperationAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  journal:any;
  compteComptableSelect:any;
  numCompteComptable:any;
  readOnly:boolean;
  typeOperation$:any;
  message:string;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @Input() entity: any;
  @Input() compteComptable2: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: NatureoperationService,
    private journalService: JournalService,
    private typeOperationService: TypeoperationService,
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
        libelleNatureOperation: [null, Validators.required],
        codeNatureOperation: [null, Validators.required],
        typeOperation: [null, Validators.required],
        journal: [null, Validators.required],
      }
    );
    this.readOnly=false;
    this.afficherJournal()
    this.afficherTypeOperation()
    // this.afficherCategorie();
    if (this.id) {
      this.readOnly=true;
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de nature opération")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de nature opération")
    }
  }
  afficherTypeOperation(){
    this.typeOperationService.afficherTous().subscribe(
      (data)=>{
        this.typeOperation$=data.data;
      }
    )
  }
  afficherJournal(){
    this.journalService.afficherTous().subscribe(
      (data)=>{
        this.journal=data.data;
        // console.log(this.journal)
      }
    )
  }
  compteComptableChange()
  {
    this.compteComptableSelect = document.getElementById("compteComptable");
    this.numCompteComptable=this.compteComptableSelect.options[this.compteComptableSelect.selectedIndex].value;
    this.entityForm.patchValue({numCompteComptable:this.numCompteComptable});
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleNatureOperation: entity.libelleNatureOperation});
    this.entityForm.patchValue({codeNatureOperation: entity.codeNatureOperation});
    this.entityForm.patchValue({journal: entity.journal});
    this.entityForm.patchValue({typeOperation: entity.typeOperation});
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
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/natureoperation']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const entity = {
      ...this.entityForm.value,
      // codeFormeJuridique: this.id ? this.id : null,
      id: this.id ? this.id : null,
    };
    console.log(entity)

    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}

