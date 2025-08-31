import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {LocalService} from "../../../../services/local.service";
import {LoaderService} from "../../../../loader.service";
import {LibrairiesService} from "../../../../services/librairies.service";
import {Router} from "@angular/router";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OperationConstatationChargesService} from "../../../services/operation-constatation-charges.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {ChargeService} from "../../../services/charge.service";
import {catchError, finalize, map} from "rxjs/operators";
import {AuthService} from "../../../../core/modules/auth";

@Component({
    selector: 'app-constatation-charges',
    templateUrl: './constatation-charges.component.html',
    styleUrl: './constatation-charges.component.scss',
    standalone: false
})
export class ConstatationChargesComponent implements OnInit, AfterViewInit, OnDestroy{

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
    private chargeService: ChargeService,
    private authService: AuthService,
    private entityService: OperationConstatationChargesService,
    private router: Router,
    private fb: FormBuilder,
    private pageInfo: PageInfoService) {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Constatation des charges");
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      id: [null],
      idOperation: [null],
      idSeance: [this.currentSeance?.idSeanceOpcvm.idSeance],
      opcvm: [this.currentOpcvm],
      charge: [null, Validators.required],
      montant: [0],
      montantCharge: [0, Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
    });
    this.afficherListeCharges();
    const sb = this.form.get('charge').valueChanges
      .pipe(
        tap(() => this.loadingService.setLoading(true)),
        switchMap(charge => {
          const dateOp = this.form.value.dateOperation;
          const param = {
            idSeance: this.currentSeance?.idSeanceOpcvm.idSeance,
            idOpcvm: this.currentOpcvm?.idOpcvm,
            code: charge.idCharge.codeCharge,
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

  afficherListeCharges() {
    this["charges$"] = this.chargeService.afficherListeChargesParIdOpcvm(this.currentOpcvm?.idOpcvm);
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
      dateValeur: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      userLogin:this.authService.currentUserValue?.username
    };
    console.log(this.id)
    if(this.id) {
      // result = this.entityService.modifier(entity, "D");
      result = of(null);
    }
    else {
      result = this.entityService.creerConstatationCharge(entity);
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
        this.router.navigate(['/opcvm/comptabilite/constatation/charges/liste']);
      })
    )
    .subscribe(value => {

    });
  }
}
