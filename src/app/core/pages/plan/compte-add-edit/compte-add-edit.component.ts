import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription, tap} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PlaceService} from "../../../services/place.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {DegreAddEditComponent} from "../../degre/degre-add-edit/degre-add-edit.component";

@Component({
  selector: 'app-compte-add-edit',
  templateUrl: './compte-add-edit.component.html',
  styleUrl: './compte-add-edit.component.scss'
})
export class CompteAddEditComponent implements OnInit, OnDestroy {
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
    private entityService: ComptecomptableService,
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
        numCompteComptable: [null, Validators.required],
        libelleCompteComptable: [null, Validators.required],
        sensMvt: [null, Validators.required],
        estMvt: [null, Validators.required],
        bilanHorsBilan: [null, Validators.required],
        type: [null, Validators.required],
      }
    );
    // this.afficherCategorie();
    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de compte comptable")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de compte comptable")
    }
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleCompteComptable: entity.libelleCompteComptable});
    this.entityForm.patchValue({numCompteComptable: entity.numCompteComptable});
    this.entityForm.patchValue({sensMvt: entity.sensMvt});
    this.entityForm.patchValue({type: entity.type});
    this.entityForm.patchValue({bilanHorsBilan: entity.bilanHorsBilan});
    this.entityForm.patchValue({estMvt: entity.estMvt});
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
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/instrumentfinancier/place']);
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
