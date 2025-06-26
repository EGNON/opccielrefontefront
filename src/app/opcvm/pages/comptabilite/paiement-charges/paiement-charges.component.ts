import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {LocalService} from "../../../../services/local.service";
import {LoaderService} from "../../../../loader.service";
import {LibrairiesService} from "../../../../services/librairies.service";
import {ChargeService} from "../../../services/charge.service";
import {AuthService} from "../../../../core/modules/auth";
import {OperationConstatationChargesService} from "../../../services/operation-constatation-charges.service";
import {Router} from "@angular/router";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize, map} from "rxjs/operators";
import {OperationPaiementChargesService} from "../../../services/operation-paiement-charges.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";

@Component({
  selector: 'app-paiement-charges',
  templateUrl: './paiement-charges.component.html',
  styleUrl: './paiement-charges.component.scss'
})
export class PaiementChargesComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  idOperationTab:any[];

  currentOpcvm: any;
  currentSeance: any;
  operationConstationCharge$: any;
  public seanceOpcvmSettings = {};
  idOpcvm:any;
  idSeance:any;

  form: FormGroup;
  private subscriptions: Subscription[] = [];
  [key: string]: any;

  constructor(
    private localStore: LocalService,
    private loadingService: LoaderService,
    private lib: LibrairiesService,
    private chargeService: ChargeService,
    private authService: AuthService,
    public seanceOpcvmService: SeanceopcvmService,
    private entityService: OperationPaiementChargesService,
    private operationConstatationChargesService: OperationConstatationChargesService,
    private router: Router,
    private fb: FormBuilder,
    private pageInfo: PageInfoService) {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherSeance(){
    this.seanceOpcvmService.listeSeanceOpcvmDesc(this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.seance=data.data
      }
    )
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    this.idSeance=item.idSeance
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.afficherListeCharges()

  }
  public onDeSelect(item: any) {
    this.idSeance=0
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.operationConstationCharge$=null
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  ngOnInit(): void {
    this.pageInfo.updateTitle("Paiement des charges");
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      id: [null],
      seance: [null],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
    });

    this.idOperationTab=[]
    this.seanceOpcvmSettings = {
      singleSelection: true,
      idField: 'idSeance',
      textField: 'libelleSeance',
      enableCheckAll: false,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.afficherSeance()
    // this.afficherListeCharges();
  }

  afficherListeCharges() {
    const entity={
      idSeance:this.idSeance,
      idOpcvm:this.idOpcvm
    }
    this.operationConstatationChargesService.afficherConstatationCharge(this.idOpcvm,this.idSeance).subscribe(
      (data)=>{
        this.operationConstationCharge$=data.data
        console.log(this.operationConstationCharge$)
      }
    )
  }
  getIdOperation(isSelected, idOperation){
     // console.log(isSelected, idOperation)
    let estPaye:string=idOperation.split(';')[1]
    let id:number=idOperation.split(';')[0]
     console.log(id,estPaye)
    // return
    if(estPaye==="true" && isSelected===true)
    {
      alert("Vous venez de cocher une charge qui a été déjà payée.veuillez la décocher")
      return;
    }
    if(isSelected===true)
      this.idOperationTab.push(id)
    else
    {
      let index=this.idOperationTab.indexOf(id)
      if(index!==-1)
        this.idOperationTab.splice(index,1)
    }
    console.log(this.idOperationTab)
  }
  save() {
    if(this.form.invalid) return;
    if(this.idOperationTab.length===0) {
      alert("Veuillez cocher les charges à payer")
      return;
    }
    let result: Observable<any>;
    let dateOp = this.form.value.dateOperation;
    const entity2={
      idSeance:this.idSeance,
      idOpcvm:this.idOpcvm
    }
    console.log(dateOp)
    let entity = {
      ...this.form.value,
      dateOperation: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      dateSolde: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      datePiece: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      dateSaisie: new Date(),
      dateValeur: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      userLogin:this.authService.currentUserValue?.username
    };
    // console.log(this.id)
    if(this.id) {
      // result = this.entityService.modifier(entity, "D");
      result = of(null);
    }
    else {
      result = this.entityService.creerPaiementCharge(this.idOperationTab,entity);
      // result = this.operationConstatationChargesService.afficherConstatationCharge(this.idOpcvm,this.idSeance);
    }
    result
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitting = false;
          this.submitted = false;
          this.idSeance=0
          this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
          this.operationConstationCharge$=null
          alert("Enregistrement effectué avec succès.Veuillez.")
          this.afficherListeCharges()
          this.router.navigate(['/opcvm/comptabilite/paiement/charges/liste']);

        })
      )
      .subscribe(value => {

      });
  }
}
