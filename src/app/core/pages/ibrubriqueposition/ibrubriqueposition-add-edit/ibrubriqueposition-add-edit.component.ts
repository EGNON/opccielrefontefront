import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormuleService} from "../../../services/formule.service";
import {TypeformuleService} from "../../../services/typeformule.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {IbService} from "../../../services/ib.service";
import {IbrubriquepositionService} from "../../../services/ibrubriqueposition.service";
import {IbrubriqueService} from "../../../services/ibrubrique.service";
import {TypeibService} from "../../../services/typeib.service";
import {TyperubriqueService} from "../../../services/typerubrique.service";

@Component({
    selector: 'app-ibrubriqueposition-add-edit',
    templateUrl: './ibrubriqueposition-add-edit.component.html',
    styleUrl: './ibrubriqueposition-add-edit.component.scss',
    standalone: false
})
export class IbrubriquepositionAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  id2?: any;
  id3?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  entityForm: FormGroup;
  dateAlerte:Date;
  compteComptable:any;
  compteComptableSelect:any;
  numCompteComptable:any;
  ib$:any;
  Typeib$:any;
  enabled:boolean;
  Typerubrique$:any;
  message:string;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @Input() entity: any;
  @Input() entityRubrique: any;
  @Input() entityPosition: any;
  @Input() compteComptable2: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: IbService,
    private ibRubriquePositionService: IbrubriquepositionService,
    private ibRubriqueService: IbrubriqueService,
    private typeIbService: TypeibService,
    private typeRubriqueService: TyperubriqueService,
    private typeFormuleService: TypeformuleService,
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
    this.entityForm = this.fb.group(
      {
        id: [null],
        codeIB: [null, Validators.required],
        libelleIb: [null, Validators.required],
        estIbSysteme: [null],
        typeIb: [null, Validators.required],
        codeRubrique: [null, Validators.required],
        libelleRubrique: [null, Validators.required],
        typeRubrique: [null, Validators.required],
        codePosition: [null, Validators.required],
        libellePosition: [null, Validators.required],
        typeValeur: [null, Validators.required],
        estModele: [null],
      }
    );
    this.enabled=false
    this.afficherTypeIB()
    this.afficherTypeRubrique()
    // this.afficherCategorie();
    if (this.id) {
      this.enabled=true
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de IB-RUBRIQUE-POSITION")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
          this.loadRubriqueValues()
          this.loadPositionValues()
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de IB-RUBRIQUE-POSITION")
    }
  }
  afficherTypeIB(){
    this.typeIbService.afficherTous().subscribe(
      (data)=>{
        this.Typeib$=data.data;
      }
    )
  }
  afficherTypeRubrique(){
    this.typeRubriqueService.afficherTous().subscribe(
      (data)=>{
        this.Typerubrique$=data.data;
      }
    )
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({codeIB: entity.codeIB});
    this.entityForm.patchValue({libelleIb: entity.libelleIb});
    this.entityForm.patchValue({typeIb: entity.typeIb});
  }
  loadRubriqueValues(){
    this.ibRubriqueService.afficherSelonId(this.id,this.id2).subscribe(
      (data)=>{
        this.entityRubrique=data.data
        this.entityForm.patchValue({codeRubrique: data.data.codeRubrique});
        this.entityForm.patchValue({libelleRubrique: data.data.libelleRubrique});
        this.entityForm.patchValue({typeRubrique: data.data.typeRubrique});
      }
    )
  }

  loadPositionValues(){
    this.ibRubriquePositionService.afficherSelonId(this.id,this.id2,this.id3).subscribe(
      (data)=>{
        this.entityPosition=data.data
        this.entityForm.patchValue({codePosition: data.data.codePosition});
        this.entityForm.patchValue({libellePosition: data.data.libellePosition});
        this.entityForm.patchValue({typeValeur: data.data.typeValeur});
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
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/ibrubriqueposition']);
      })
    )
      .subscribe(
        (data)=>{
          this.ib$=data?.data

          if(this.id){
            const entity={
              codeRubrique:this.entityForm.value.codeRubrique,
              libelleRubrique:this.entityForm.value.libelleRubrique,
              typeRubrique:this.entityForm.value.typeRubrique,
              ib:this.ib$
            }
            this.ibRubriqueService.modifier(this.ib$.codeIB,this.entityForm.value.codeRubrique,entity).subscribe();

            const entityPosition={
              codePosition:this.entityForm.value.codePosition,
              libellePosition:this.entityForm.value.libellePosition,
              codeRubrique:this.entityForm.value.codeRubrique,
              typeValeur:this.entityForm.value.typeValeur,
              ib:this.ib$,
              estModele:true
            }
            this.ibRubriquePositionService.modifier(this.ib$.codeIB,this.entityForm.value.codeRubrique,this.entityForm.value.codePosition,entityPosition).subscribe();
          }
          else
          {
            const entity={
              codeRubrique:this.entityForm.value.codeRubrique,
              libelleRubrique:this.entityForm.value.libelleRubrique,
              typeRubrique:this.entityForm.value.typeRubrique,
              ib:this.ib$
            }
            this.ibRubriqueService.create(entity).subscribe();

            const entityPosition={
              codePosition:this.entityForm.value.codePosition,
              libellePosition:this.entityForm.value.libellePosition,
              codeRubrique:this.entityForm.value.codeRubrique,
              typeValeur:this.entityForm.value.typeValeur,
              ib:this.ib$,
              estModele:true
            }
            this.ibRubriquePositionService.create(entityPosition).subscribe();
          }
        }
      );
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

