import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Pays} from "../../../../crm/models/pays.model";
import {Profession} from "../../../../crm/models/profession.model";
import {NgbDate, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {filter, map} from "rxjs/operators";
import {PaysService} from "../../../../crm/services/pays.service";
import {ProfessionService} from "../../../../crm/services/profession.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PageInfoService} from "../../../../template/_metronic/layout";
declare var $:JQueryStatic;
import "select2";

@Component({
  selector: 'app-personnel-add-edit',
  templateUrl: './personnel-add-edit.component.html',
  styleUrl: './personnel-add-edit.component.scss'
})
export class PersonnelAddEditComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  payss$: any;
  professions$: any;
  entity: any;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];

  defaultPaysNationalite?: Pays;
  defaultPaysResidence?: Pays;
  defaultProfession?: Profession;

  constructor(
    private entityService: PersonnelService,
    private paysService: PaysService,
    private professionService: ProfessionService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    const sb = this.route.paramMap
      .pipe(
        filter(paramMap => paramMap.has('id')),
        map(paramMap => paramMap.get('id')!),
        tap((id) => this.id = +id),
        switchMap(id => this.entityService.getById(Number.parseInt(id)))
      ).subscribe(entity => this.loadFormValues(entity));
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idPersonne: [this.id],
        nom: [null, Validators.required],
        prenom: [null, Validators.required],
        sexe: [null, Validators.required],
        dateNaissance: [null, Validators.required],
        civilite: [null, Validators.required],
        statutMatrimonial: [null, Validators.required],
        profession: [null, Validators.required],
        paysNationalite: [null, Validators.required],
        mobile1: [null, Validators.required],
        paysResidence: [null],
        mobile2: [null],
        emailPro: [null, Validators.email],
        emailPerso: [null, Validators.email],
        estCommercial: [null, Validators.required],
        matricule: [""],
      }
    );
    if(this.id)
      this.pageInfo.updateTitle("Modification de personnel")
    else
      this.pageInfo.updateTitle("Ajout de personnel")

    this.subscriptions.push(sb);
    this.getPaysAll();
    this.getProfessionAll();
  }

  get f() { return this.entityForm.controls; }

  getPaysAll = () => {
    this.paysService.afficherPaysListe().subscribe(
      (data)=>{
        this.payss$=data;
      }
    )
  }

  getProfessionAll = () => {
    this.professionService.afficherListe().subscribe(
      (data)=>{
        this.professions$=data;
      }
    )
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({id: entity.idPersonne});
    this.entityForm.patchValue({idPersonne: entity.idPersonne});
    this.entityForm.patchValue({estCommercial: entity.estCommercial});
    this.entityForm.patchValue({nom: entity.nom});
    this.entityForm.patchValue({estActif: entity.estActif});
    this.entityForm.patchValue({prenom: entity.prenom});
    this.entityForm.patchValue({sexe: entity.sexe});
    let dateNaissance = new Date(entity.dateNaissance);
    this.entityForm.patchValue({dateNaissance: new NgbDate(
        dateNaissance.getFullYear(), dateNaissance.getMonth()+1, dateNaissance.getDate())});
    this.entityForm.patchValue({civilite: entity.civilite});
    this.entityForm.patchValue({statutMatrimonial: entity.statutMatrimonial});
    this.entityForm.patchValue({mobile1: entity.mobile1});
    this.entityForm.patchValue({mobile2: entity.mobile2});
    this.entityForm.patchValue({username: entity.username});
    this.entityForm.patchValue({password: entity.password});
    this.entityForm.patchValue({paysNationalite: entity.paysNationalite});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({profession: entity.profession});
    this.entityForm.patchValue({emailPro: entity.emailPro});
    this.entityForm.patchValue({emailPerso: entity.emailPerso});

    this.defaultPaysNationalite = entity.paysNationalite;
    this.defaultPaysResidence = entity.paysResidence;
    this.defaultProfession = entity.profession;
  }

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;
    console.log("FORM === ", this.entityForm);
    if(this.entityForm.invalid) return;

    this.submitting = true;
    const sb = this.saveEntity().subscribe({
      next: () => {
        this.router.navigate(['personnels'], {relativeTo: this.route});
      },
      error: () => {}
    });
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let dateNaiss: any;
    if(this.entityForm.controls.dateNaissance.value)
    {
      dateNaiss = new Date(
        this.entityForm.controls.dateNaissance.value.year,
        this.entityForm.controls.dateNaissance.value.month-1,
        this.entityForm.controls.dateNaissance.value.day+1);
    }
    const entity = {
      ...this.entityForm.value,
      dateNaissance: dateNaiss
    }
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }
}
