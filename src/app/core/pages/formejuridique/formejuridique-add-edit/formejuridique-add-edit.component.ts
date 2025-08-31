import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SousCategorieService} from "../../../../titresciel/services/souscategorie.service";
import {CategorieService} from "../../../../crm/services/categorie.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {FormejuridiqueService} from "../../../../crm/services/formejuridique.service";

@Component({
    selector: 'app-formejuridique-add-edit',
    templateUrl: './formejuridique-add-edit.component.html',
    styleUrl: './formejuridique-add-edit.component.scss',
    standalone: false
})
export class FormejuridiqueAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  formeJuridiqueForm: FormGroup;
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
    private formeJuridiqueService: FormejuridiqueService,
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
    this.formeJuridiqueForm = this.fb.group(
      {
        id: [null],
        codeFormeJuridique: [null, Validators.required],
        libelleFormeJuridique: [null, Validators.required],
      }
    );
    // this.afficherCategorie();
    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de forme juridique")
      const sb = this.formeJuridiqueService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de forme juridique")
    }
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.formeJuridiqueForm.patchValue({libelleFormeJuridique: entity.libelleFormeJuridique});
    this.formeJuridiqueForm.patchValue({codeFormeJuridique: entity.codeFormeJuridique});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.formeJuridiqueForm.controls;
  }
  onSaveEntity() {

    const sb = this.saveEntity().pipe(
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/formejuridique']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const formeJuridique = {
      ...this.formeJuridiqueForm.value,
      // codeFormeJuridique: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    console.log(formeJuridique)

    return this.id
      ? this.formeJuridiqueService.update(formeJuridique)
      : this.formeJuridiqueService.create(formeJuridique);
  }
}
