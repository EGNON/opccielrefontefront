import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {LoaderService} from "../../../../loader.service";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-depotsouscription-add-edit',
    templateUrl: './depotsouscription-add-edit.component.html',
    styleUrl: './depotsouscription-add-edit.component.scss',
    standalone: false
})
export class DepotsouscriptionAddEditComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;

  entity: any;
  title: string;
  solde: number = 0;
  soldeEspece: number = 0;

  currentOpcvm: any;
  currentSeance: any;
  form: FormGroup;
  private subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private localStore: LocalService,
    private entityService: DepotsouscriptionService,
    private personneService: PersonneService,
    private fb: FormBuilder,
    private pageInfo: PageInfoService,
    private loadingService: LoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    console.log("Séance actuelle === ", this.currentSeance);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      id: [null],
      idOperation: [0],
      idTransaction: [1],
      idDepotRachat: [null],
      idSeance: [this.currentSeance?.idSeance],
      opcvm: [this.currentOpcvm],
      transaction: [null],
      natureOperation: [null],
      actionnaire: [null, Validators.required],
      personne: [null, Validators.required],
      libelleOperation: [null, Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      valeurFormule: [null],
      valeurCodeAnalytique: [null],
      dateSaisie: [null],
      datePiece: [null],
      dateValeur: [null],
      estOD: [false],
      estGenere: [false],
      estVerifier: [false],
      estVerifie1: [false],
      estVerifie2: [false],
      userLoginVerificateur1: [""],
      dateVerification1: [null],
      userLoginVerificateur2: [""],
      dateVerification2: [null],
      dateVerification: [null],
      nomVerificateur: [""],
      referencePiece: [null],
      modeVL: ["CONNU", Validators.required],
      quantite: [0],
      ecriture: ["A"],
      type: ["S"],
      soldeEspece: [0],
      montantSouscrit: [0, Validators.required],
      montant: [0, Validators.required],
    });

    //Récupération de l'object correspondant à id
    const paramSubscription = this.route.paramMap
      .pipe(
        map(paramMap => {
          let params: any = new Array(2);
          if(paramMap.has('id'))
          {
            params[0] = +paramMap.get('id')!;
            // this.title = "Modification de " + this.title;
          }

          return params;
        }),
        tap((params) => {
          this.id = params[0];
        }),
        filter(params => params[0]!),
        switchMap(params => this.entityService.getById(params[0]))
      ).subscribe(resp => this.loadFormValues(resp.data));
    this.subscriptions.push(paramSubscription);

    this.getPersonnesAll('distributeurs');
    this.getPersonnesAll('actionnaires');

    const sb = this.form.get('actionnaire').valueChanges.pipe(
      tap(() => this.loadingService.setLoading(true)),
      switchMap(actionnaire => {
        return this.entityService.solde(actionnaire.idPersonne, this.currentOpcvm?.idOpcvm).pipe(
          map(result => {
            return {
              actionnaire: actionnaire,
              solde: result
            }
          })
        );
      })
    ).subscribe(resp => {
      this.solde = resp.solde;
      this.form.patchValue({soldeEspece: this.solde});
      if(!this.id) {
        this.form.patchValue({montantSouscrit: 0});
        this.form.patchValue({montant: 0});
      }
      this.loadingService.setLoading(false);
      console.log("Solde === ", resp);
    });
    this.subscriptions.push(sb);
    const sb1 = this.form.get('montant').valueChanges.subscribe(value => {
      const montant = value !== "" ? parseFloat(value) : 0;
      const monntantSouscrit = this.form.value.montantSouscrit !== "" ? parseFloat(this.form.value.montantSouscrit) : 0;
      /*if(this.id) {
        this.soldeEspece += this.entity?.montantSouscrit;
      }*/
      this.soldeEspece = this.solde + montant - monntantSouscrit;
      this.form.patchValue({soldeEspece: this.soldeEspece});
      if(montant > 0)
        this.form.patchValue({libelleOperation: `DEPOT DE ${montant} FCFA POUR SOUSCRIPTION`});
      else
        this.form.patchValue({libelleOperation: null});
    });
    this.subscriptions.push(sb1);
    const sb2 = this.form.get('montantSouscrit').valueChanges.subscribe(value => {
      const montant = this.form.value.montant !== "" ? parseFloat(this.form.value.montant) : 0;
      const montantSouscrit = value !== "" ? parseFloat(value) : 0;
      if(this.soldeEspece < montantSouscrit) {
        this.form.patchValue({montantSouscrit: this.soldeEspece});
        this.form.patchValue({soldeEspece: 0});
      }
      else {
        this.form.patchValue({soldeEspece: this.solde + montant - montantSouscrit});
      }
      if(montant === 0 && montantSouscrit > 0)
        this.form.patchValue({libelleOperation: `REINVESTISSEMENT DE  ${montantSouscrit} FCFA POUR SOUSCRIPTION`});
      /*else
        this.form.patchValue({libelleOperation: `DEPOT DE ${montant} FCFA POUR SOUSCRIPTION`});*/
    });
    this.subscriptions.push(sb2);

    if(this.id)
    {
      this.title = "Modification de dépôt pour souscription";
      this.pageInfo.updateTitle(this.title);
      /*this.entityService.getById(this.id).subscribe((resp) => {
        const entity = resp.data;
        this.loadFormValues(entity);
      });*/
    }
    else
    {
      this.title = "Ajout de dépôt pour souscription";
      this.pageInfo.updateTitle(this.title);
    }
  }

  getPersonnesAll(qualite: any = null)
  {
    const name = qualite[qualite.length-1] === "s" ? `${qualite}$` : `${qualite}s$`;
    this[name] = this.personneService.afficherPersonneSelonQualite(qualite.toUpperCase().trim());
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    console.log("Entity === ", entity);
    this.form.patchValue(entity);
    this.form.patchValue({id: entity.idDepotRachat});
    let dateOperation = new Date(entity.dateOperation);
    this.form.patchValue({dateOperation: new NgbDate(
        dateOperation.getFullYear(), dateOperation.getMonth()+1, dateOperation.getDate())});
    this.form.patchValue({emitEvent: false});
  }

  save() {
    if(this.form.invalid) return;
    let result: Observable<any>;
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 26);
    futureDate.setMonth(11, 31);
    this.form.patchValue({datePiece: this.form.get("dateOperation").value});
    this.form.patchValue({dateValeur: this.form.get("dateOperation").value});
    let entity = this.form.value;
    for (const key in entity)
    {
      let value = entity[key];
      if(key.includes("date") && value != null) {
        const date = new Date(value.year, value.month-1, value.day+1);
        entity = {...entity, [key]: date};
      }
    }
    entity = {
      ...entity,
      natureOperation: {
        codeNatureOperation: "DEP_SOUS"
      },
      idSeance: this.currentSeance?.idSeanceOpcvm?.idSeance,
      opcvm: this.currentOpcvm,
      dateSaisie: new Date(),
      dateVerification: futureDate,
      dateVerification1: futureDate,
      dateVerification2: futureDate,
      valeurFormule: `2:${entity.montant}`,
      valeurCodeAnalytique: `OPC:${this.currentOpcvm?.idOpcvm};ACT:${entity.actionnaire?.idPersonne}`
    }
    console.log("Send form === ", entity);
    if(this.id) {
      result = this.entityService.modifier(entity, "D");
    }
    else {
      result = this.entityService.creer(entity, "D");
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
        this.router.navigate(['/opcvm/souscription/depotsouscription']);
      });
  }
}
