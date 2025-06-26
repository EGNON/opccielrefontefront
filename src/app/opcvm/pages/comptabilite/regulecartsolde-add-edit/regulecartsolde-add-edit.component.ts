import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {FormuleService} from "../../../../core/services/formule.service";
import {LoaderService} from "../../../../loader.service";
import {OperationregulecartsoldeService} from "../../../services/operationregulecartsolde.service";

@Component({
  selector: 'app-regulecartsolde-add-edit',
  templateUrl: './regulecartsolde-add-edit.component.html',
  styleUrl: './regulecartsolde-add-edit.component.scss'
})
export class RegulecartsoldeAddEditComponent implements OnInit, OnDestroy{
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
  formule$:any;
  currentOpcvm: any;
  currentSeance: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: OperationregulecartsoldeService,
    public personneService: PersonneService,
    public formuleService: FormuleService,
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
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idOperation: [null],
        ecart: [0],
        soldeEspeceDepositaire: [0, Validators.required],
        soldeLogique: [0, Validators.required],
        dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
          Validators.required],
      }
    );
    if(!this.id)
      this.afficherSoldeCompte()
    // this.getPersonne()
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de régul écart solde")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de régul écart solde")


  }
  afficherSoldeCompte(){
    this.loadingService.setLoading(true)
    const entity={
      ib:this.currentOpcvm?.idOpcvm,
      rubrique:"14000",
      position:"01",
      date:this.currentSeance?.dateFermeture
    }
    this.formuleService.soldeCompte(entity).subscribe(
      (data)=>{
        this.formule$=data.data
        console.log(this.formule$)
        this.entityForm.patchValue({soldeLogique:data.data})
        this.loadingService.setLoading(false)
      }
    )
  }
  onSoldedeposiataireKeyPress($event) {
    let ecart:number=0
    ecart=Number($event.target.value)-Number(this.entityForm.value.soldeLogique)
    this.entityForm.patchValue({ecart:ecart})
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    // console.log(entity)
    let soldeLogique=Number(entity.soldeEspeceDepositaire)-Number(entity.montant)
    this.entityForm.patchValue({soldeLogique:soldeLogique.toString()});
    this.entityForm.patchValue({soldeEspeceDepositaire: entity.soldeEspeceDepositaire.toString()});
    this.entityForm.patchValue({ecart: entity.montant.toString()});
    let dateOperation = new Date(entity.dateOperation);
    this.entityForm.patchValue({dateOperation: new NgbDate(
        dateOperation.getFullYear(), dateOperation.getMonth()+1, dateOperation.getDate())});

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
          this.router.navigate(['/opcvm/comptabilite/regulecartsolde/liste']);
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
    let dateOperation: any;
    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
   let idOperation=0
    if(this.id)
      idOperation=this.id

    const entity: any = {
      ...this.entityForm.value,
      idOperation:idOperation,
      dateOperation:dateOperation,
      userLogin:this.authService.currentUserValue?.username,
      opcvm:this.opcvm,
      idSeance:this.currentSeance?.idSeanceOpcvm.idSeance
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(entity)
      : this.entityService.create (entity);
  }
}

