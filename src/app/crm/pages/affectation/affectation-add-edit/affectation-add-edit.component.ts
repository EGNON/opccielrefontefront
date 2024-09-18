import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription, switchMap, tap} from "rxjs";
import {ModeleObjectifService} from "../../../services/modele-objectif.service";
import {PersonnelService} from "../../../services/personne/personnel.service";
import {CategorieService} from "../../../services/categorie.service";
import {IndicateurService} from "../../../services/indicateur.service";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {AffectationService} from "../../../services/affectation.service";
import {Personnel} from "../../../models/personne/personnel.model";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-affectation-add-edit',
  templateUrl: './affectation-add-edit.component.html',
  styleUrls: ['./affectation-add-edit.component.scss']
})
export class AffectationAddEditComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entityForm: FormGroup;
  modeles: Array<any> = [];
  personnels$: any;
  categories: Array<any> = [];
  _objectifAffectes: Array<any> = [];
  defaultPersonnel?: Personnel;
  private subscriptions: Subscription[] = [];

  constructor(
    private entityService: AffectationService,
    private modeleService: ModeleObjectifService,
    private personnelService: PersonnelService,
    private categorieService: CategorieService,
    private indicateurService: IndicateurService,
    private pageInfo: PageInfoService,
    private periodiciteService: PeriodiciteService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        id: [null],
        idAffectation: [null],
        dateAffectation: [null],
        personnel: [null, Validators.required],
        modeleObjectif: [null],
        objectifAffectes: this.fb.array([]),
      }
    );
    //Récupération de l'object correspondant à id
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('id')),
        map(paramMap => paramMap.get('id')!),
        tap((id) => this.id = +id),
        switchMap(id => this.entityService.getEntityById(id))
      ).subscribe(entity => this.loadFormValues(entity));
    this.subscriptions.push(sb);
    this.getPersonnelAll();
    this.getModeleAll();

    if(this.id)
      this.pageInfo.updateTitle("Modification d'une affectation")
    else
      this.pageInfo.updateTitle("Ajout d'une affectation")

    //Ecouter le changement de type planification
    this.entityForm.get("modeleObjectif")?.valueChanges.subscribe(f=> {
      this.objectifAffectes.clear();
      f.detailObjectifs.forEach((item: any) => {
        let newItem = {
          categoriePersonne: item.categoriePersonne,
          indicateur: item.indicateur,
          periodicite: item.periodicite,
          valeurAffecte: null
        }
        this.onAddElement(newItem);
      });
      this._objectifAffectes = f.detailObjectifs;
      this.entityForm.controls.objectifAffectes.patchValue(this._objectifAffectes);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  getModeleAll()
  {
    this.modeleService.fetch();
    const sb = this.modeleService.afficherTous().subscribe(data => {
      this.modeles = data;
    });
    this.subscriptions.push(sb);
  }

  getPersonnelAll()
  {
    this.personnelService.afficherListe().subscribe(
      (data)=>{
        this.personnels$=data;
      }
    )
  }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get objectifAffectes(): FormArray {
    return <FormArray>this.entityForm.get('objectifAffectes')
  }

  loadFormValues(entity: any)
  {
    this.entityForm.patchValue({id: entity.idAffectation});
    this.defaultPersonnel = entity.personnel;
    entity.objectifAffectes.forEach((item: any) => {
      this.onAddElement(item);
    });
    this._objectifAffectes = entity.objectifAffectes;
    this.entityForm.patchValue(entity);
  }

  onAddElement(data: any) {
    this.objectifAffectes.push(this.createItem(data));
  }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;

    this.submitting = true;
    const sb = this.saveEntity()
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['affectation'], {relativeTo: this.route});
        },
        error: () => {
          return of(undefined);
        }
      });
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let entity: any = {
      id: this.entityForm.value.id,
      idAffectation: this.entityForm.value.idAffectation,
      dateAffectation: this.entityForm.value.dateAffectation,
      objectifAffectes: this.entityForm.value.objectifAffectes,
      personnel: this.entityForm.value.personnel
    };

    return this.id
      ? this.entityService.updateRow({...entity})
      : this.entityService.createRow({...entity, dateAffectation: new Date()});
  }

  ngAfterViewInit(): void {
  }
}
