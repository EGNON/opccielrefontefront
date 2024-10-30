import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {catchError, finalize, map} from "rxjs/operators";
import {LoaderService} from "../../../../loader.service";
import {LocalService} from "../../../../services/local.service";

@Component({
  selector: 'app-depotsouscription-add-edit',
  templateUrl: './depotsouscription-add-edit.component.html',
  styleUrl: './depotsouscription-add-edit.component.scss'
})
export class DepotsouscriptionAddEditComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;

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
  ) {}

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    this.form = this.fb.group({
      id: [null],
      idOperation: [null],
      idSeance: [this.currentSeance?.idSeance],
      opcvm: [this.currentOpcvm],
      transaction: [null],
      natureOperation: [null],
      actionnaire: [null, Validators.required],
      personne: [null, Validators.required],
      libelleOperation: [null, Validators.required],
      dateOperation: [null, Validators.required],
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
      userLoginVerificateur1: [null],
      userLoginVerificateur2: [null],
      dateVerification: [null],
      nomVerificateur: [null],
      referencePiece: [null],
      modeVL: [null, Validators.required],
      quantite: [0],
      ecriture: ["A"],
      type: ["S"],
      soldeEspece: [0],
      montantSouscrit: [0, Validators.required],
      montant: [0, Validators.required],
    });
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
      this.form.patchValue({montantSouscrit: 0});
      this.form.patchValue({montant: 0});
      this.loadingService.setLoading(false)
      console.log("Solde === ", resp);
    });
    this.subscriptions.push(sb);
    const sb1 = this.form.get('montant').valueChanges.subscribe(value => {
      const montant = value !== "" ? parseFloat(value) : 0;
      const monntantSouscrit = this.form.value.montantSouscrit !== "" ? parseFloat(this.form.value.montantSouscrit) : 0;
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
      else
        this.form.patchValue({libelleOperation: `DEPOT DE ${montant} FCFA POUR SOUSCRIPTION`});
    });
    this.subscriptions.push(sb2);
    if(this.id)
    {
      this.title = "Modification de dépôt pour souscription";
      this.pageInfo.updateTitle(this.title);
      this.entityService.getById(this.id).subscribe((resp) => {
        const entity = resp.data;
        this.loadFormValues(entity);
      });
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
    this.form.patchValue({id: this.id});
    this.form.patchValue({idOperation: entity.idOperation});
  }

  save() {
    if(this.form.invalid) return;
    let result: Observable<any>;
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
      valeurFormule: `2:${entity.montant}`,
      valeurCodeAnalytique: `OPC:${this.currentOpcvm?.idOpcvm};ACT:${entity.actionnaire?.idPersonne}`
    }
    console.log("Send form === ", entity);
    if(this.id) {
      result = this.entityService.update(entity);
    }
    else {
      result = this.entityService.create(entity);
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

          this.router.navigate(['/opcvm/souscription/depotsouscription']);
        })
      )
      .subscribe(value => {
        console.log("Submit form === ", value);
      });
  }
}
