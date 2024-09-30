import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Pays} from "../../../../crm/models/pays.model";
import {PaysService} from "../../../../crm/services/pays.service";
import {MonnaieService} from "../../../../crm/services/monnaie.service";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'lab-pays-add-edit',
  templateUrl: './pays-add-edit.component.html',
  styleUrl: './pays-add-edit.component.scss'
})
export class PaysAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: any;
  pays$: any;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  submitted = false;
  entityForm: FormGroup;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: PaysService,
    public paysService: PaysService,
    public monnaieService: MonnaieService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idPays: [this.id],
        libelleFr: [null, Validators.required],
        libelleEn: [null, Validators.required],
        indicatif: [null, Validators.required],
        monnaieDto: [null, Validators.required],
        paysDto: [ null],
        estGafi: [false],
      }
    );
    this.getMonnaieAll();
    this.getPaysAll()
    this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de pays GAFI")
      const sb = this.entityService.getEntityById(this.id)
        .subscribe((entity)=>{
          this.entity=entity;
          this.loadFormValues(entity);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de pays GAFI")
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleFr:
      entity.libelleFr});
    this.entityForm.patchValue({libelleEn: entity.libelleEn});
    this.entityForm.patchValue({id: entity.idPays});
    this.entityForm.patchValue({indicatif: entity.indicatif});
    this.entityForm.patchValue({monnaieDto: entity.monnaieDto});
    this.entityForm.patchValue({paysDto: entity});
    this.entityForm.patchValue({estGafi: entity.estGafi});
  }
  retournerPays()
  {
    this.idPays = this.paysSelect.options[this.paysSelect.selectedIndex].value;
    this.id=this.idPays;
    const sb = this.entityService.getEntityById(this.idPays)
      .subscribe((entity)=>{
        this.entity=entity;
        this.loadFormValues(entity);
      });
    this.subscriptions.push(sb);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getMonnaieAll()
  {
    const sb  = this.monnaieService.afficherMonnaieListe().subscribe(
      (res) =>{ this.monnaies$= res});

  }
  getPaysAll()
  {
    const sb  = this.paysService.afficherListe().subscribe(
      (res) =>{ this.pays$ = res});

  }

  get f() { return this.entityForm.controls; }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/lab/standard/parametre/pays']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const entity: any = {
      ...this.entityForm.value
    };
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}

