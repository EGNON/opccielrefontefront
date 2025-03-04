import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {LocalService} from "../../../../services/local.service";
import {LoaderService} from "../../../../loader.service";
import {LibrairiesService} from "../../../../services/librairies.service";
import {Router} from "@angular/router";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OperationCommissionService} from "../../../services/operation-commission.service";
import {catchError, finalize, map} from "rxjs/operators";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-paiement-commission',
  templateUrl: './paiement-commission.component.html',
  styleUrl: './paiement-commission.component.scss'
})
export class PaiementCommissionComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;

  currentOpcvm: any;
  currentSeance: any;
  form: FormGroup;
  private subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private localStore: LocalService,
    private loadingService: LoaderService,
    private lib: LibrairiesService,
    private entityService: OperationCommissionService,
    private router: Router,
    private fb: FormBuilder,
    private pageInfo: PageInfoService) {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Paiement des commissions et taxes");
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      id: [null],
      idOperation: [null],
      idSeance: [this.currentSeance?.idSeanceOpcvm.idSeance],
      opcvm: [this.currentOpcvm],
      typeCommission: [null, Validators.required],
      montant: [0],
      montantCommission: [0, Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
    });
    this["typeCommissions"] = [
      "RACHAT",
      "SOUSCRIPTION",
      "TAFA"
    ];
    const sb = this.form.get('typeCommission').valueChanges
      .pipe(
        tap(() => this.loadingService.setLoading(true)),
        switchMap(typeCommission => {
          const dateOp = this.form.value.dateOperation;
          const param = {
            idSeance: this.currentSeance?.idSeanceOpcvm.idSeance,
            idOpcvm: this.currentOpcvm?.idOpcvm,
            code: typeCommission,
            dateEstimation: new Date(dateOp.year, dateOp.month-1, dateOp.day+1)
          };
          return this.lib.soldeToutCompte(param).pipe(
            map(result => {
              if(result != null) {
                const data: any[] = result.data;
                return data[data.length-1];
              }
              else
              {
                return null;
              }
            })
          );
        })
      )
      .subscribe(resp => {
        this.form.patchValue({montant: resp?.soldeReel});
        this.loadingService.setLoading(false);
      });
    this.subscriptions.push(sb);
  }

  save() {
    if(this.form.invalid) return;
    let result: Observable<any>;
    let dateOp = this.form.value.dateOperation;
    let entity = {
      ...this.form.value,
      dateOperation: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      dateSolde: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      datePiece: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      dateSaisie: new Date(),
      dateValeur: new Date(dateOp.year, dateOp.month-1, dateOp.day+1)
    };
    console.log("Entity === ", entity);
    if(this.id) {
      // result = this.entityService.modifier(entity, "D");
      result = of(null);
    }
    else {
      result = this.entityService.creerPaiementCom(entity);
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
          this.router.navigate(['/opcvm/comptabilite/paiement/commission/liste']);
        })
      )
      .subscribe(value => {

      });
  }
}
