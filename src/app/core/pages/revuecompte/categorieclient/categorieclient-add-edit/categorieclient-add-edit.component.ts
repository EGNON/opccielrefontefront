import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CategorieclientService} from "../../../../services/revuecompte/categorieclient.service";
import {CryptageService} from "../../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";

@Component({
  selector: 'app-categorieclient-add-edit',
  templateUrl: './categorieclient-add-edit.component.html',
  styleUrl: './categorieclient-add-edit.component.scss'
})
export class CategorieclientAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  readOnly:boolean;
  message:string;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @Input() entity: any;
  @Input() ClientComptable2: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: CategorieclientService,
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
        intitule: [null, Validators.required],
        code: [null, Validators.required],
      }
    );
    this.readOnly=false;
    // this.afficherCategorie();
    if (this.id) {
      this.readOnly=true;
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de Categorie Client")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de Categorie Client")
    }
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({intitule: entity.intitule});
    this.entityForm.patchValue({code: entity.code});
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
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/nomenclature/categorieclient']);
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
    console.log(entity);
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}
