import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {OperationregulecartsoldeService} from "../../../services/operationregulecartsolde.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {FormuleService} from "../../../../core/services/formule.service";
import {AuthService} from "../../../../core/modules/auth";
import {LoaderService} from "../../../../loader.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {OperationService} from "../../../services/operation.service";

@Component({
    selector: 'app-paiement-commission-investissement-add-edit',
    templateUrl: './paiement-commission-investissement-add-edit.component.html',
    styleUrl: './paiement-commission-investissement-add-edit.component.scss',
    standalone: false
})
export class PaiementCommissionInvestissementAddEditComponent implements OnInit, OnDestroy{
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
    public entityService: OperationService,
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
        montant: [0, Validators.required],
        libelleOperation: [null, Validators.required],
        dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
          Validators.required],
      }
    );

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
      this.pageInfo.updateTitle("Ajout de paiement des commissions sur investissement")


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
          this.router.navigate(['/opcvm/comptabilite/retrocessioncommissioninvestissement/liste']);
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
      datePiece:this.currentSeance?.dateFermeture,
      userLogin:this.authService.currentUserValue?.username,
      opcvm:this.opcvm,
      idSeance:this.currentSeance?.idSeanceOpcvm.idSeance
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.creer(entity);
  }
}

