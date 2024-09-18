import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {delay, of, Subscription, tap} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {CritereAlerteService} from "../../../../lab/services/criterealerte.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {CritereAlerte} from "../../../../lab/models/criterealerte.model";
import {SousCategorieService} from "../../../../titresciel/services/souscategorie.service";
import {Categorie} from "../../../../crm/models/categorie.model";
import {CategorieService} from "../../../../crm/services/categorie.service";

@Component({
  selector: 'app-souscategorie-add-edit',
  templateUrl: './souscategorie-add-edit.component.html',
  styleUrl: './souscategorie-add-edit.component.scss'
})
export class SouscategorieAddEditComponent implements OnInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  sousCategorieForm: FormGroup;
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
    private sousCategorieService: SousCategorieService,
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
    this.sousCategorieForm = this.fb.group(
      {
        id: [null],
        libelleSousCategorie: [null, Validators.required],
        categoriePersonne: [null, Validators.required],
      }
    );
    this.afficherCategorie();
    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de sous catégorie")
      const sb = this.sousCategorieService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de sous catégorie")
    }
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.sousCategorieForm.patchValue({libelleSousCategorie: entity.libelleSousCategorie});
    this.sousCategorieForm.patchValue({categoriePersonne: entity.categoriePersonne});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.sousCategorieForm.controls;
  }
  afficherCategorie()
  {
    this.categorieService.afficherListe().subscribe(
      (data)=>{
        this.categoriePersonne$=data;
      }
    )
  }
  onSaveSousCategorie() {

    const sb = this.saveCritereAlerte().pipe(
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/souscategorie']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveCritereAlerte() {
    const sousCategorie = {
      ...this.sousCategorieForm.value,
      idSousCategorie: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    console.log(sousCategorie)

    return this.id
      ? this.sousCategorieService.update(sousCategorie)
      : this.sousCategorieService.create(sousCategorie);
  }
}
