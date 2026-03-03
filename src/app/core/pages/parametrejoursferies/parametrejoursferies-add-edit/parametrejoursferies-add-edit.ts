import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, catchError, of, finalize } from 'rxjs';
import { MonnaieService } from '../../../../crm/services/monnaie.service';
import { PaysService } from '../../../../crm/services/pays.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { LibrairiesService } from '../../../../services/librairies.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parametrejoursferies-add-edit',
  standalone: false,
  templateUrl: './parametrejoursferies-add-edit.html',
  styleUrl: './parametrejoursferies-add-edit.scss'
})
export class ParametrejoursferiesAddEdit implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  monnaies$: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: LibrairiesService,
    public monnaieService: MonnaieService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    let date =new Date();
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        numLigne: [this.id],
        date: [new NgbDate(date.getFullYear(),date.getMonth()+1,date.getDate()), Validators.required],
        description: [null, Validators.required],
        estAnnuel: [false],
      }
    );
    
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification jours fériés")
      const sb = this.entityService.afficherJoursFeriesById(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de jours fériés")
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({description:
      entity.description});
    this.entityForm.patchValue({estAnnuel: entity.estAnnuel});
    let date=new Date(entity.date)
    this.entityForm.patchValue({date: new NgbDate(date.getFullYear(),date.getMonth()+1,date.getDate())});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getMonnaieAll()
  {
    this.monnaieService.afficherMonnaieListe().subscribe(
      (data)=>{
        this.monnaies$=data;
      }
    )
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
          this.router.navigate(['/app/standard/parametre/joursferies']);
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let date: any;
      if (this.entityForm.controls.date.value) {
        date = new Date(
          this.entityForm.controls.date.value.year,
          this.entityForm.controls.date.value.month-1,
          this.entityForm.controls.date.value.day+1);
      }
    const entity: any = {
      ...this.entityForm.value,
      date:date
    };
    return this.id
      ? this.entityService.modifierJoursFeries(entity)
      : this.entityService.enregistrerJoursFeries(entity);
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }
}
