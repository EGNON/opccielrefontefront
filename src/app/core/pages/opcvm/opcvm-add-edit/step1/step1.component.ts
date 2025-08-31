import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription, tap} from "rxjs";
import {Opcvm} from "../../../../models/opcvm";
import {ClassificationOpcService} from "../../../../services/classification-opc.service";
import {map} from "rxjs/operators";
import {FormeJuridiqueOpcService} from "../../../../services/forme-juridique-opc.service";
import {PersonnePhysiqueService} from "../../../../../crm/services/personne/personne.physique.service";
import {PersonneService} from "../../../../../crm/services/personne/personne.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss',
    standalone: false
})
export class Step1Component implements OnInit, AfterViewInit, OnChanges, OnDestroy{
  @Input('updateParentModel') updateParentModel: (
    part: Partial<Opcvm>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Opcvm>;
  @Input() id: number = 0;
  private unsubscribe: Subscription[] = [];

  classification$: Observable<any>;
  formeJuridiqueOpc$: Observable<any>;

  [key: string]: any;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private personneService: PersonneService,
    private classificationOpcService: ClassificationOpcService,
    private formeJuridiqueOpcService: FormeJuridiqueOpcService) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel(this.defaultValues, this.checkForm());
    this.classification$ = this.getAllClassification().pipe(
      map(resp => resp.data)
    );
    this.formeJuridiqueOpc$ = this.getAllFormeJuridiqueOpc().pipe(
      map(resp => resp.data)
    );
    this.getPersonnesAll('emetteur');
    this.getPersonnesAll('gestionnaires');
    this.getPersonnesAll('depositaire');
  }

  getPersonnesAll(qualite: any = null)
  {
    const name = qualite[qualite.length-1] === "s" ? `${qualite}$` : `${qualite}s$`;
    console.log("NAME === ", name);
    this[name] = this.personneService.afficherPersonneSelonQualite(qualite.toUpperCase().trim()).pipe(
      tap(resp => console.log(qualite, " === ", resp))
    );
  }

  initForm() {
    let dateAgrement = new Date(this.defaultValues.dateAgrement);
    let dateCreationOpcvm = new Date(this.defaultValues.dateCreationOpcvm);
    this.form = this.fb.group({
      sigleOpcvm: [this.defaultValues.sigleOpcvm, [Validators.required]],
      denominationOpcvm: [this.defaultValues.denominationOpcvm, [Validators.required]],
      registreDeCommerce: [this.defaultValues.registreDeCommerce, [Validators.required]],
      agrement: [this.defaultValues.agrement, [Validators.required]],
      classification: [
        this.defaultValues.classification,
        [Validators.required],
      ],
      coursInitial: [this.defaultValues.coursInitial, [Validators.required]],
      coursActuel: [this.defaultValues.coursActuel, [Validators.required]],
      dateAgrement: [new NgbDate(dateAgrement.getFullYear(), dateAgrement.getMonth()+1, dateAgrement.getDate())],
      dateCreationOpcvm: [new NgbDate(dateCreationOpcvm.getFullYear(), dateCreationOpcvm.getMonth()+1, dateCreationOpcvm.getDate())],
      formeJuridiqueOpc: [this.defaultValues.formeJuridiqueOpc, [Validators.required]],
      personneEmetteur: [this.defaultValues.personneEmetteur, [Validators.required]],
      personneIntervenant: [this.defaultValues.personneIntervenant, [Validators.required]],
      personneGestionnaire: [this.defaultValues.personneGestionnaire, [Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('sigleOpcvm')?.hasError('required') ||
      this.form.get('denominationOpcvm')?.hasError('required') ||
      this.form.get('registreDeCommerce')?.hasError('required') ||
      this.form.get('agrement')?.hasError('required') ||
      this.form.get('classification')?.hasError('required') ||
      this.form.get('formeJuridiqueOpc')?.hasError('required') ||
      this.form.get('personneEmetteur')?.hasError('required') ||
      this.form.get('personneIntervenant')?.hasError('required') ||
      this.form.get('personneGestionnaire')?.hasError('required') ||
      this.form.get('coursInitial')?.hasError('required') ||
      this.form.get('coursActuel')?.hasError('required')
    );
  }

  getAllClassification() {
    return this.classificationOpcService.get();
  }

  getAllFormeJuridiqueOpc() {
    return this.formeJuridiqueOpcService.get();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    /*let change = changes['defaultValues'];
    console.log("X === ", change);
    if(!change.firstChange) {
      this.defaultValues = change.currentValue;
      this.form.patchValue({sigleOpcvm: change.currentValue.sigleOpcvm});
      this.form.patchValue({denominationOpcvm: change.currentValue.denominationOpcvm});
      this.form.patchValue({registreDeCommerce: change.currentValue.registreDeCommerce});
      this.form.patchValue({agrement: change.currentValue.agrement});
      this.form.patchValue({classification: change.currentValue.classification});
      this.form.patchValue({coursInitial: change.currentValue.coursInitial});
      this.form.patchValue({coursActuel: change.currentValue.coursActuel});
      this.form.patchValue({dateAgrement: change.currentValue.dateAgrement});
      this.form.patchValue({dateCreationOpcvm: change.currentValue.dateCreationOpcvm});
      this.form.patchValue({formeJuridiqueOpc: change.currentValue.formeJuridiqueOpc});
      this.form.patchValue({personneEmetteur: change.currentValue.personneEmetteur});
      this.form.patchValue({personneIntervenant: change.currentValue.personneIntervenant});
      this.form.patchValue({personneGestionnaire: change.currentValue.personneGestionnaire});
      console.log(change.currentValue);
      console.log(change.previousValue);
    }*/
  }
}
