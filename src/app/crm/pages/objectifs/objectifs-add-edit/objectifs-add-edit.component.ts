import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription, switchMap, tap} from "rxjs";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CategorieService} from "../../../services/categorie.service";
import {IndicateurService} from "../../../services/indicateur.service";
import {ModeleObjectifService} from "../../../services/modele-objectif.service";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-objectifs-add-edit',
  templateUrl: './objectifs-add-edit.component.html',
  styleUrls: ['./objectifs-add-edit.component.scss']
})
export class ObjectifsAddEditComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entityForm: FormGroup;
  categories: any;
  indicateurs: any;
  periodicites: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private entityService: ModeleObjectifService,
    private categorieService: CategorieService,
    private indicateurService: IndicateurService,
    private periodiciteService: PeriodiciteService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idModelObj: [this.id],
        nomModele: [null, Validators.required],
        detailObjectifs: this.fb.array([]),
      }
    );
    //Récupération de l'object correspondant à id
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('id')),
        // tap(paramMap => console.log(paramMap)),
        map(paramMap => paramMap.get('id')!),
        tap((id) => this.id = +id),
        switchMap(id => this.entityService.getEntityById(id))
      ).subscribe(entity => this.loadFormValues(entity));
    this.subscriptions.push(sb);
    this.getCategorieAll();
    this.getIndicateursAll();
    this.getPeriodiciteAll();
    if(this.id)
      this.pageInfo.updateTitle("Modification d'objectif")
    else
      this.pageInfo.updateTitle("Ajout d'objectif")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  getPeriodiciteAll()
  {
    this.periodiciteService.afficherListe().subscribe(
      (data)=>{
        this.periodicites=data;
      }
    )
    // const sb = this.periodiciteService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.periodiciteService.fetch();
    // const sb1 = this.periodiciteService.items$.subscribe(data => {
    //   this.periodicites = data;
    // });
    // this.subscriptions.push(sb1);
  }

  getCategorieAll()
  {
    this.categorieService.afficherListe().subscribe(
      (data)=>{
        this.categories=data;
      }
    )
    // const sb = this.categorieService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.categorieService.fetch();
    // const sb1 = this.categorieService.items$.subscribe(data => {
    //   this.categories = data;
    // });
    // this.subscriptions.push(sb1);
  }

  getIndicateursAll() {
    this.indicateurService.afficherListe().subscribe(
      (data)=>{
        this.indicateurs=data;
      }
    )
    // const sb = this.indicateurService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.indicateurService.fetch();
    // const sb1 = this.indicateurService.items$.subscribe(data => {
    //   this.indicateurs = data;
    // });
    // this.subscriptions.push(sb1);
  }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get details(): FormArray {
    return <FormArray>this.entityForm.get('detailObjectifs')
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    if(entity.detailObjectifs != null && entity.detailObjectifs.length > 0)
    {
      entity.detailObjectifs.forEach((item:any) => {
        this.onAddModele();
      });
    }
    entity.id = entity.idModelObj;
    this.entityForm.patchValue(entity);
  }

  onAddModele() {
    this.details.push(this.createItem({
      categoriePersonne: null,
      indicateur: null,
      periodicite: null,
    }));
  }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;

    this.submitting = true;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.router.navigate(['objectifAaffecter'], {relativeTo: this.route});
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveEntity() {
    return this.id
      ? this.entityService.updateRow(this.entityForm.value)
      : this.entityService.createRow(this.entityForm.value);
  }

  ngAfterViewInit(): void {
  }

  supprimerDetail(i: number) {
    this.details.removeAt(i);
  }
}
