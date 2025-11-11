import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, catchError, of, finalize } from 'rxjs';
import { Opcvm } from '../../../../core/models/opcvm';
import { AuthService } from '../../../../core/modules/auth';
import { FormuleService } from '../../../../core/services/formule.service';
import { Monnaie } from '../../../../crm/models/monnaie.model';
import { PersonneService } from '../../../../crm/services/personne/personne.service';
import { LoaderService } from '../../../../loader.service';
import { LocalService } from '../../../../services/local.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { Actionnaireopcvm } from '../../../models/actionnaireopcvm.model';
import { OperationregulecartsoldeService } from '../../../services/operationregulecartsolde.service';
import { ExerciceService } from '../../../services/exercice.service';
import { PlanService } from '../../../../core/services/plan.service';

@Component({
  selector: 'app-exercice-add-edit',
  standalone: false,
  templateUrl: './exercice-add-edit.html',
  styleUrl: './exercice-add-edit.scss'
})
export class ExerciceAddEdit  implements OnInit, OnDestroy{
  id?: number;
  public personneSettings = {};
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  actionnaireOpcvm: Actionnaireopcvm;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  plan$:any;
  currentOpcvm: any;
  currentSeance: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: ExerciceService,
    public personneService: PersonneService,
    public planService: PlanService,
    public authService: AuthService,
    public loadingService: LoaderService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateSeance = new Date();
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        codeExercice: [null, Validators.required],
        estBloque: [false],
        estCourant: [true],
        estFerme: [false],
        tauxBenefice: [0],
        montantMinimum: [0],
        plan: ['', Validators.required],
        declassement: ['', Validators.required],
        dateDebut: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
          Validators.required],
        dateFin: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
          Validators.required],
        dateCloture: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
          Validators.required],
      }
    );
      this.afficherPlan();
  
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification d'exercice'")
      const sb = this.entityService.afficherExerciceById(this.currentOpcvm?.idOpcvm,this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout d'exercice'")


  }
  afficherPlan(){
    this.loadingService.setLoading(true)
    this.planService.afficherTous().subscribe(
      (data)=>{
        this.plan$=data.data
        this.loadingService.setLoading(false)
      }
    )
  }
 
  loadFormValues(entity: any)
  {
    this.entity = entity;
    // console.log(entity)
    this.entityForm.patchValue({montantMinimum: entity.montantMinimum.toString()});
    this.entityForm.patchValue({tauxBenefice: entity.tauxBenefice.toString()});
    this.entityForm.patchValue({codeExercice: entity.codeExercice});
    this.entityForm.patchValue({plan: entity.plan});
    this.entityForm.patchValue({declassement: entity.declassement});
    this.entityForm.patchValue({estBloque: entity.estBloque});
    this.entityForm.patchValue({estFerme: entity.estFerme});
    this.entityForm.patchValue({estCourant: entity.estCourant});
    this.entityForm.patchValue({estCourant: entity.estCourant});
    let dateDebut = new Date(entity.dateDebut);
    this.entityForm.patchValue({dateDebut: new NgbDate(
        dateDebut.getFullYear(), dateDebut.getMonth()+1, dateDebut.getDate())});
    let dateFin = new Date(entity.dateFin);
    this.entityForm.patchValue({dateFin: new NgbDate(
        dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate())});
    let dateCloture = new Date(entity.dateCloture);
    this.entityForm.patchValue({dateCloture: new NgbDate(
        dateCloture.getFullYear(), dateCloture.getMonth()+1, dateCloture.getDate())});

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  get personnes(): FormArray { return <FormArray>this.entityForm.get('personne')}



  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }

  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  get f() { return this.entityForm.controls; }


  onSaveEntity()
  {
    /*this.tableau = document.getElementById("table_PersonneOpcvm");
    var length = this.tableau.getElementsByTagName('tr').length
    if (length == 1) {
      alert("Veuillez ajouter au moins un actionnaire")
      return;
    }*/
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
          this.router.navigate(['/opcvm/comptabilite/exercice/liste']);
        })
      )
      .subscribe(
        (data)=>{

        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm=new Opcvm();

    this.opcvm.idOpcvm=this.currentOpcvm?.idOpcvm
    let dateDebut: any;
    if(this.entityForm.controls.dateDebut.value)
    {
      dateDebut = new Date(
        this.entityForm.controls.dateDebut.value.year,
        this.entityForm.controls.dateDebut.value.month-1,
        this.entityForm.controls.dateDebut.value.day+1);
    }
    let dateFin: any;
    if(this.entityForm.controls.dateFin.value)
    {
      dateFin = new Date(
        this.entityForm.controls.dateFin.value.year,
        this.entityForm.controls.dateFin.value.month-1,
        this.entityForm.controls.dateFin.value.day+1);
    }
    let dateCloture: any;
    if(this.entityForm.controls.dateCloture.value)
    {
      dateCloture = new Date(
        this.entityForm.controls.dateCloture.value.year,
        this.entityForm.controls.dateCloture.value.month-1,
        this.entityForm.controls.dateCloture.value.day+1);
    }

    const entity: any = {
      ...this.entityForm.value,
      dateDebut:dateDebut,
      dateFin:dateFin,
      dateCloture:dateCloture,
      userLogin:this.authService.currentUserValue?.username,
      opcvm:this.opcvm,
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(entity,this.opcvm.idOpcvm,this.entityForm.value.codeExercice)
      : this.entityService.create (entity);
  }
}

