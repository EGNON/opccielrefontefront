import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TypecompteService} from "../../../../services/revuecompte/typecompte.service";
import {CryptageService} from "../../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {SoustypecompteService} from "../../../../services/revuecompte/soustypecompte.service";

@Component({
  selector: 'app-soustypecompte-add-edit',
  templateUrl: './soustypecompte-add-edit.component.html',
  styleUrl: './soustypecompte-add-edit.component.scss'
})
export class SoustypecompteAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  typeCompte$:any;
  compteComptableSelect:any;
  numCompteComptable:any;
  readOnly:boolean;
  TypeTypeCompte$:any;
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
    private entityService: SoustypecompteService,
    private typeCompteService: TypecompteService,
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
        libelleSousTypeCompte: [null, Validators.required],
        codeSousTypeCompte: [null, Validators.required],
        typeCompte: [null, Validators.required],
      }
    );
    this.readOnly=false;
    this.afficherTypeCompte()
    // this.afficherCategorie();
    if (this.id) {
      this.readOnly=true;
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de Sous type Compte")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de Sous type Compte")
    }
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleSousTypeCompte: entity.libelleSousTypeCompte});
    this.entityForm.patchValue({codeSousTypeCompte: entity.codeSousTypeCompte});
    this.entityForm.patchValue({typeCompte: entity.typeCompte});
  }
  afficherTypeCompte(){
    this.typeCompteService.afficherTous().subscribe(
      (data)=>{
        this.typeCompte$=data.data;
      }
    )
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
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/nomenclature/soustypecompte']);
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

