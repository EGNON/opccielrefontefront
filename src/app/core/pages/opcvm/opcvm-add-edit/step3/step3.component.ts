import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {Opcvm} from "../../../../models/opcvm";
import {PaysService} from "../../../../../crm/services/pays.service";
import {VilleService} from "../../../../../crm/services/ville.service";

@Component({
    selector: 'app-step3',
    templateUrl: './step3.component.html',
    styleUrl: './step3.component.scss',
    standalone: false
})
export class Step3Component {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<Opcvm>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Opcvm>;

  private unsubscribe: Subscription[] = [];

  pays$: Observable<any>;
  villes$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private villeService: VilleService,
    private paysService: PaysService) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, this.checkForm());
    this.pays$ = this.getAllPays();
    this.villes$ = this.getAllVille();
  }

  initForm() {
    this.form = this.fb.group({
      telephoneFixe: [this.defaultValues.telephoneFixe],
      telephoneMobile: [this.defaultValues.telephoneMobile],
      fax: [this.defaultValues.fax],
      boitePostale: [this.defaultValues.boitePostale],
      pays: [this.defaultValues.pays, [Validators.required]],
      ville: [this.defaultValues.ville, [Validators.required]],
      codeSkype: [this.defaultValues.codeSkype],
      email: [this.defaultValues.email, [Validators.email]],
      adresseComplete: [this.defaultValues.adresseComplete],
      siteweb: [this.defaultValues.siteweb],
      capitalInitialOpcvm: [this.defaultValues.capitalInitialOpcvm],
      valeurLiquidativeOrigine: [this.defaultValues.valeurLiquidativeOrigine, [Validators.required]],
      valeurLiquidativeActuelle: [this.defaultValues.valeurLiquidativeActuelle, [Validators.required]],
      nbrePartDebutExercice: [this.defaultValues.nbrePartDebutExercice, [Validators.required]],
      nbrePartInitial: [this.defaultValues.nbrePartInitial, [Validators.required]],
      nbrePartActuelle: [this.defaultValues.nbrePartActuelle, [Validators.required]],
      dateProchainCalculVL: [null, [Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('telephoneFixe')?.hasError('required') ||
      this.form.get('telephoneMobile')?.hasError('required') ||
      this.form.get('pays')?.hasError('required') ||
      this.form.get('valeurLiquidativeOrigine')?.hasError('required') ||
      this.form.get('valeurLiquidativeActuelle')?.hasError('email')
    );
  }

  getAllPays() {
    return this.paysService.afficherListe();
  }

  getAllVille() {
    return this.villeService.afficherVilleListe();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
