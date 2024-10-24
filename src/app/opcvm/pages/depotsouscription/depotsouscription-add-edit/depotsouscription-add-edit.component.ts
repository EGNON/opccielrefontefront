import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";

@Component({
  selector: 'app-depotsouscription-add-edit',
  templateUrl: './depotsouscription-add-edit.component.html',
  styleUrl: './depotsouscription-add-edit.component.scss'
})
export class DepotsouscriptionAddEditComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() id?: number;
  submitting = false;
  title: string;

  currentOpcvm: any;
  form: FormGroup;
  private subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private entityService: DepotsouscriptionService,
    private personneService: PersonneService,
    private fb: FormBuilder,
    private pageInfo: PageInfoService
  ) {}

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.currentOpcvm = JSON.parse(window.localStorage.getItem("currentOpcvm"));
    this.form = this.fb.group({
      id: [null],
      idOperation: [null],
      opcvm: [null],
      transaction: [null],
      natureOperation: [null],
      actionnaire: [null, Validators.required],
      distributeur: [null, Validators.required],
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
    this.form.get('montant').valueChanges.subscribe(value => {
      if(value)
        this.form.patchValue({libelleOperation: `DEPOT DE ${value} FCFA POUR SOUSCRIPTION`});
      else
        this.form.patchValue({libelleOperation: null});
      //console.log("Vous avez changé la valeur pour : " + value);
    });
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
      opcvm: this.currentOpcvm,
      dateSaisie: new Date(),
      valeurFormule: `2:${entity.montant}`,
      valeurCodeAnalytique: `OPC:${this.currentOpcvm?.idOpcvm};ACT:${entity.actionnaire?.idPersonne}`
    }
    console.log("Send form === ", entity);
  }
}
