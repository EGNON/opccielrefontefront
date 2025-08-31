import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {delay, of, Subscription, tap} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {PlanService} from "../../../services/plan.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {IbrubriquepositionService} from "../../../services/ibrubriqueposition.service";
import {CorrespondanceService} from "../../../services/correspondance.service";

@Component({
    selector: 'app-correspondance-add-edit',
    templateUrl: './correspondance-add-edit.component.html',
    styleUrl: './correspondance-add-edit.component.scss',
    standalone: false
})
export class CorrespondanceAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  id2?: any;
  id3?: any;
  id4?: any;
  id5?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  compteComptable$:any;
  compteComptable2$:any;
  ibRubriquePosition$:any;
  ibRubriquePosition2$:any;
  message:string;

  //plan:Plan;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  @Input() codePlan: any;
  @Input() plan$:any;
  @Input() entity: any;
  @Input() isModal: boolean = false;
  estModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: CorrespondanceService,
    private planService: PlanService,
    private compteComptableService: ComptecomptableService,
    private ibRubriquePositionService: IbrubriquepositionService,
    private cryptageService: CryptageService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dateAlerte = new Date();

    this.id = this.route.snapshot.params['id'];//codeIB
    this.id2 = this.route.snapshot.params['id2'];//codeRubrique
    this.id3 = this.route.snapshot.params['id3'];//codePosition
    this.id4 = this.route.snapshot.params['id4'];//codePlan
    this.id5 = this.route.snapshot.params['id5'];//numCompteComptable
    this.entityForm = this.fb.group(
      {
        id: [null],
        compteComptable: [null, Validators.required],
        ibRubriquePosition: [null, Validators.required],
        plan: [null, Validators.required],
      }
    );
    this.estModal=false;
    this.afficherPlan();
    this.afficherIbRubriquePosition()

    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de correspondance")
      const sb = this.entityService.afficherSelonId(this.id,this.id2,this.id3,this.id4,this.id5)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de correspondance")
    }
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({plan: entity.plan});
    this.compteComptableService.afficherSelonNumCompteComptable(entity.numCompteComptable).subscribe(
      (data)=>{
        this.compteComptable2$=data.data
        this.entityForm.patchValue({compteComptable: this.compteComptable2$});
      }
    )
    this.ibRubriquePositionService.afficherSelonId(this.id,this.id2,this.id3).subscribe(
      (data)=>{
        this.ibRubriquePosition2$=data.data
        this.entityForm.patchValue({ibRubriquePosition: this.ibRubriquePosition2$});
      }
    )
  }
  afficherPlan(){
      this.planService.afficherTous().subscribe(
        (data)=>{
          this.plan$=data.data
        }
      )
  }
  afficherCompteComptable(){
      this.compteComptableService.afficherSelonPlanEtEstMvtListe(this.entityForm.value.plan.codePlan).subscribe(
        (data)=>{
          this.compteComptable$=data.data
          // console.log(this.compteComptable$)
        }
      )
  }
  afficherIbRubriquePosition(){
      this.ibRubriquePositionService.afficherTous().subscribe(
        (data)=>{
          this.ibRubriquePosition$=data.data
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
      delay(1000), // Remove it from your code (just for showing loading)
      tap((resp) => {
        // console.log("SELECT === ", resp);
        // const option = document.createElement('option');
        // option.text = resp.data.libelle;
        // option.value = resp.data;
        // option.selected = true;
        // this.degreSelect.add(option);

        this.passEntry.emit(resp.data);
        this.modal.close();
      }),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/correspondance']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const entity = {
      numeroCompteComptable:this.entityForm.value.compteComptable.numCompteComptable,
      plan:this.entityForm.value.plan,
      ib:this.entityForm.value.ibRubriquePosition.ib,
      codeRubrique:this.entityForm.value.ibRubriquePosition.codeRubrique,
      codePosition:this.entityForm.value.ibRubriquePosition.codePosition,
      // codeFormeJuridique: this.id ? this.id : null,
      id: this.id ? this.id : null
    };
    console.log(entity)

    return this.id
      ? this.entityService.modifier(this.entityForm.value.ibRubriquePosition.ib.codeIB,
                                    this.entityForm.value.ibRubriquePosition.codeRubrique,
                                    this.entityForm.value.ibRubriquePosition.codePosition,
                                    this.entityForm.value.plan.codePlan,
                                    this.entityForm.value.compteComptable.numCompteComptable,
                                    entity)
      : this.entityService.create(entity);
  }
}
