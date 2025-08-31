import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {PaysService} from "../../../../crm/services/pays.service";
import {MonnaieService} from "../../../../crm/services/monnaie.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
declare var $:JQueryStatic;
import "select2";

@Component({
    selector: 'app-pays-add-edit',
    templateUrl: './pays-add-edit.component.html',
    styleUrls: ['./pays-add-edit.component.scss'],
    standalone: false
})
export class PaysAddEditComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  monnaies$: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    public entityService: PaysService,
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
        estGafi: [false],
      }
    );
    this.getMonnaieAll();
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de pays")
      const sb = this.entityService.getEntityById(this.id)
        .subscribe((entity)=>{
          this.entity=entity;
          this.loadFormValues(entity);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de pays")
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleFr:
      entity.libelleFr});
    this.entityForm.patchValue({libelleEn: entity.libelleEn});
    this.entityForm.patchValue({indicatif: entity.indicatif});
    this.entityForm.patchValue({monnaieDto: entity.monnaieDto});
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
          this.router.navigate(['/app/standard/parametre/pays']);
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

  ngAfterViewInit(): void {
    $('.select2').select2();
  }
}
