import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription, tap} from "rxjs";
import {Opcvm} from "../../../../models/opcvm";
import {TypeAffectationVlService} from "../../../../services/type-affectation-vl.service";
import {map} from "rxjs/operators";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrl: './step2.component.scss',
    standalone: false
})
export class Step2Component implements OnInit, OnDestroy{
  @Input('updateParentModel') updateParentModel: (
    part: Partial<Opcvm>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Opcvm>;

  private unsubscribe: Subscription[] = [];

  typeAffectation$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private typeAffectationService: TypeAffectationVlService) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, this.checkForm());
    this.typeAffectation$ = this.getAllTypeAffectation().pipe(
      map(resp => resp.data)
    );
  }

  initForm() {
    let dateDebExo = new Date(this.defaultValues.debutExerciceActuelOpcvm);
    this.form = this.fb.group({
      dureeMinimalPlacement: [
        this.defaultValues.dureeMinimalPlacement,
        [Validators.required],
      ],
      uniteDureeMinimalPlacement: [this.defaultValues.uniteDureeMinimalPlacement, [Validators.required]],
      valeurMinimalPlacement: [this.defaultValues.valeurMinimalPlacement, [Validators.required]],
      typeAffectationTitre: [this.defaultValues.typeAffectationTitre, [Validators.required]],
      periodiciteCalculValeurLiquidativeOpcvm: [
        this.defaultValues.periodiciteCalculValeurLiquidativeOpcvm,
        [Validators.required]
      ],
      unitePeriodiciteCalculValeurLiquidative: [
        this.defaultValues.unitePeriodiciteCalculValeurLiquidative,
        [Validators.required]
      ],
      debutExerciceActuelOpcvm: [new NgbDate(dateDebExo.getFullYear(), dateDebExo.getMonth()+1, dateDebExo.getDate())],
      finExerciceActuelOpcvm: [null],
      tauxTAF: [this.defaultValues.tauxTAF],
      appliqueeTAF: [this.defaultValues.appliqueeTAF],
      appliqueeTVA: [this.defaultValues.appliqueeTVA],
      tauxRetrocessionSouscription: [this.defaultValues.tauxRetrocessionSouscription, [Validators.required]],
      tauxRetrocessionRachat: [this.defaultValues.tauxRetrocessionRachat, [Validators.required]],
      tauxCommissionSouscription: [this.defaultValues.tauxCommissionSouscription, [Validators.required]],
      tauxCommissionRachat: [this.defaultValues.tauxCommissionRachat, [Validators.required]],
      visaNoteInformation: [this.defaultValues.visaNoteInformation, [Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !this.form.get('accountName')?.hasError('required');
  }

  getAllTypeAffectation() {
    return this.typeAffectationService.get();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
