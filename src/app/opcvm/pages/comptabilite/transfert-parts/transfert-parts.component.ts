import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, tap} from "rxjs";
import {LocalService} from "../../../../services/local.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {LibrairiesService} from "../../../../services/librairies.service";
import {catchError, finalize} from "rxjs/operators";
import {LoaderService} from "../../../../loader.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OperationTransfertService} from "../../../services/operation-transfert.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";

@Component({
  selector: 'app-transfert-parts',
  templateUrl: './transfert-parts.component.html',
  styleUrl: './transfert-parts.component.scss'
})
export class TransfertPartsComponent implements OnInit, AfterViewInit, OnDestroy{

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
    private authService: AuthService,
    private lib: LibrairiesService,
    private entityService: OperationTransfertService,
    private personneService: PersonneService,
    private router: Router,
    private fb: FormBuilder,
    private pageInfo: PageInfoService) {
  }

  getPersonnesAll(qualite: any = null)
  {
    const name = qualite[qualite.length-1] === "s" ? `${qualite}$` : `${qualite}s$`;
    this[name] = this.personneService.afficherPersonneSelonQualite(qualite.toUpperCase().trim());
  }

  chargerInfosD($event: Event, data: any) {
    let demandeur = this.form.get("demandeur").value;
    let param = {
      idOpcvm: this.currentOpcvm?.idOpcvm,
      idActionnaire: demandeur?.idPersonne,
      dateEstimation: this.currentSeance?.dateFermeture
    };
    // this["registre$"] = this.lib.registreActionnaire(param);
    //Récupérer le nombre de part actuel de l'actionnaire sélectionné
    this.lib.registreActionnaire(param).pipe(
      tap(() => this.loadingService.setLoading(true)),
      catchError((err: any, caught: any) => {
        console.log(err);
        return of(err.message);
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    )
    .subscribe(resp => {
      let parts: any[] = resp.data;
      if(parts != null && parts.length > 0)
      {
        let part = parts[0];
        this.form.patchValue({qteAvtD: part?.nombrePartActuel});
        this.form.patchValue({qteApresD: this.form.get("qteAvtD").value - this.form.get("qteTrans").value});
      }
      else {
        this.form.patchValue({qteAvtD: 0});
      }
    });

    //Récupérer le cump de l'actionnaire sélectionné
    this.lib.cumpActionnaire(param).pipe(
      tap(() => this.loadingService.setLoading(true)),
      catchError((err: any, caught: any) => {
        console.log(err);
        return of(err.message);
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    )
    .subscribe(resp => {
      let cump = resp.data;
      this.form.patchValue({cumpEntre: cump});
      console.log("Cump === ", cump);
    });
  }

  chargerInfosB($event: Event, data: any) {
    let beneficiaire = this.form.get("beneficiaire").value;
    let param = {
      idOpcvm: this.currentOpcvm?.idOpcvm,
      idActionnaire: beneficiaire?.idPersonne,
      dateEstimation: this.currentSeance?.dateFermeture
    };
    //Récupérer le nombre de part actuel de l'actionnaire sélectionné
    this.lib.registreActionnaire(param).pipe(
      tap(() => this.loadingService.setLoading(true)),
      catchError((err: any, caught: any) => {
        console.log(err);
        return of(err.message);
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    )
    .subscribe(resp => {
      let parts: any[] = resp.data;
      if(parts != null && parts.length > 0)
      {
        let part = parts[0];
        this.form.patchValue({qteAvtB: part?.nombrePartActuel});
        this.form.patchValue({qteApresB: this.form.get("qteAvtB").value + this.form.get("qteTrans").value});
      }
      else {
        this.form.patchValue({qteAvtB: 0});
      }
    });
  }

  save() {
    if(this.form.invalid) return;
    let result: Observable<any>;
    let dateOp = this.form.value.dateOperation;
    let entity = {
      ...this.form.value,
      dateOperation: new Date(dateOp.year, dateOp.month-1, dateOp.day+1),
      userLogin:this.authService.currentUserValue?.username
    };
    if(this.id) {
      // result = this.entityService.modifier(entity, "D");
      result = of(null);
    }
    else {
      result = this.entityService.creerTransfert(entity);
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
        })
      )
      .subscribe(value => {
        console.log("Submit form === ", value);
        this.router.navigate(['/opcvm/comptabilite/transfert/parts/liste']);
      });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Transfert de parts");
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      id: [null],
      idOperation: [0],
      idSeance: [this.currentSeance?.idSeanceOpcvm.idSeance],
      opcvm: [this.currentOpcvm],
      demandeur: [null, Validators.required],
      beneficiaire: [null, Validators.required],
      qteAvtD: [0, Validators.required],
      qteApresD: [0, Validators.required],
      qteAvtB: [0, Validators.required],
      qteApresB: [0, Validators.required],
      qteTrans: [0, Validators.required],
      cumpEntre: [0, Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
    });
    this.getPersonnesAll('actionnaires');
    // Lorsque le nombre de parts change
    const sb = this.form.get('qteTrans').valueChanges.subscribe(value => {
      const qteTrans = value !== "" ? parseFloat(value) : 0;
      const qteAvtD = this.form.value.qteAvtD !== "" ? parseFloat(this.form.value.qteAvtD) : 0;
      const qteAvtB = this.form.value.qteAvtB !== "" ? parseFloat(this.form.value.qteAvtB) : 0;
      //Calculer la quantité disponible de parts du demandeur
      if(qteAvtD != 0) {
        this.form.patchValue({qteApresD: qteAvtD - qteTrans});
      }
      //Calculer la quantité disponible de parts du bénéficiaire
      if(qteAvtB != 0) {
        this.form.patchValue({qteApresB: qteAvtB + qteTrans});
      }
    });
    this.subscriptions.push(sb);
  }
}
