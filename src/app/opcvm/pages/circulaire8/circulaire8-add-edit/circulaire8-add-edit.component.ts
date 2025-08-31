import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {ChargeService} from "../../../services/charge.service";
import {NatureoperationService} from "../../../../core/services/natureoperation.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Infoscirculaire8Service} from "../../../services/infoscirculaire8.service";

@Component({
    selector: 'app-circulaire8-add-edit',
    templateUrl: './circulaire8-add-edit.component.html',
    styleUrl: './circulaire8-add-edit.component.scss',
    standalone: false
})
export class Circulaire8AddEditComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  id2?: number;
  id3?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  natureOperation$: any;
  estVisibleAppliquerTypeCharge:boolean;
  place$: any;
  classeTitre$: any;
  personne: any;
  actionnaireOpcvm: Actionnaireopcvm;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  dateRecup:string[];
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: Infoscirculaire8Service,
    public natureOperationService: NatureoperationService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    let date=new Date()
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        dateDebut: [new NgbDate(date.getFullYear(), date.getMonth()+1, date.getDate()),Validators.required],
        dateFin: [new NgbDate(date.getFullYear(), date.getMonth()+1, date.getDate()),Validators.required],
        evenementMarquant: [null,Validators.required],

      }
    );

    // this.getNatureOperation()

    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de circulaire 8")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de circulaire 8")

  }
  loadFormValues(entity: any)
  {
    // let taux=entity.montant;
    this.entity = entity;
    console.log(this.entity)
    let dateDebut = new Date(entity.dateDebut);
    let dateFin = new Date(entity.dateFin);
    this.entityForm.patchValue({dateDebut: new NgbDate(
        dateDebut.getFullYear(), dateDebut.getMonth()+1, dateDebut.getDate())});
    this.entityForm.patchValue({dateFin: new NgbDate(
        dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate())});
    this.entityForm.patchValue({evenementMarquant:entity.evenementMarquant});

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }



  get f() { return this.entityForm.controls; }


  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;
    this.submitting = true;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.submitting = false;
          this.isLoading = false;
          this.router.navigate([`/opcvm/circulaire8`]);
        })
      )
      .subscribe();

    this.subscriptions.push(sb);
  }
  appliquerTypeCharge(){
    if(this.entityForm.value.typeCharge==="VARIABLE")
      this.estVisibleAppliquerTypeCharge=true;
    else
      this.estVisibleAppliquerTypeCharge=false;
  }
  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    let dateDebut: any;
    let dateFin: any;
    if(this.entityForm.controls.dateDebut.value)
    {
      dateDebut = new Date(
        this.entityForm.controls.dateDebut.value.year,
        this.entityForm.controls.dateDebut.value.month-1,
        this.entityForm.controls.dateDebut.value.day+1);
    }

    if(this.entityForm.controls.dateFin.value)
    {
      dateFin = new Date(
        this.entityForm.controls.dateFin.value.year,
        this.entityForm.controls.dateFin.value.month-1,
        this.entityForm.controls.dateFin.value.day+1);
    }


    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm,
      dateDebut:dateDebut,
      dateFin:dateFin,
      numLigne:this.id,
      userLogin:this.authService.currentUserValue?.username
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(entity)
      : this.entityService.create(entity);
  }
}
