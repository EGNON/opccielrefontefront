import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {DegreService} from "../../../../crm/services/degre.service";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {SecteurAddEditComponent} from "../../secteur/secteur-add-edit/secteur-add-edit.component";
import {SocieteDeGestionService} from "../../../../crm/services/societedegestion.service";
import {FormejuridiqueService} from "../../../../crm/services/formejuridique.service";
import {ResponseModel} from "../../../../crm/models/table.model";
import {CommuneService} from "../../../../crm/services/commune.service";

@Component({
    selector: 'app-societedegestion-add-edit',
    templateUrl: './societedegestion-add-edit.component.html',
    styleUrl: './societedegestion-add-edit.component.scss',
    standalone: false
})
export class SocietedegestionAddEditComponent implements OnInit, OnDestroy{

  qualite: string;
  id?: string;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entityForm!: FormGroup;
  secteurs$: any;
  formeJuridique$: Observable<ResponseModel<any>>;
  payss$:any;
  commune$:any;
  title: string;

  private subscriptions: Subscription[] = [];

  etatConversion: boolean = false;

  constructor(
    private modalService: NgbModal,
    private pageInfo: PageInfoService,
    private entityService: SocieteDeGestionService,
    private personneService: PersonneService,
    private personnelService: PersonnelService,
    private degreService: DegreService,
    private secteurService: SecteurService,
    private paysService: PaysService,
    private communeService: CommuneService,
    private formeJuridiqueService: FormejuridiqueService,
    private qualiteService: QualiteService,
    private statutPersonneService: StatutPersonneService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = "Société de gestion (SGO)";
    this.submitted = false;
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idPersonne: [this.id],
        //Champs Personne Morale
        sigle: [null, Validators.required],
        raisonSociale: [null, Validators.required],
        siteWeb: [null],
        //Champs communs
        formeJuridique: [null, Validators.required],
        numeroAgrementPersonneMorale: [null, Validators.required],
        mobile1: [null, Validators.required],
        numRegistre: [null, Validators.required],
        capitalSocial: [null, Validators.required],
        mobile2: [null],
        fixe1: [null],
        fixe2: [null],
        // ifu: [null, Validators.required],
        bp: [null],
        dateAgrement: [null, Validators.required],
        dateCreationPM: [null, Validators.required],
        commune: [null, Validators.required],
        // distributeur: [null],
        secteur: [null, Validators.required],
        emailPerso: [null, Validators.email],
        emailPro: [null, Validators.email],
        // numeroCpteDeposit: [null, Validators.required],
        paysResidence: [null, Validators.required],
        domicile: [null],
        codeAgence:[null],
        typeTeneurCompte:[null],
        numeroOrdreTeneur:[null],
      }
    );

    //Récupération de l'object correspondant à id
    const paramSubscription = this.route.paramMap
      .pipe(
        map(paramMap => {
          let params: any = new Array(2);
          if(paramMap.has('id'))
          {
            params[0] = +paramMap.get('id')!;
            // this.title = "Modification de " + this.title;
          }
          if(paramMap.has('etat'))
            params[1] = +paramMap.get('etat')! == 1;
          else
            params[1] = false;

          return params;
        }),
        tap((params) => {
          this.id = params[0];
          this.etatConversion = params[1];
        }),
        filter(params => params[0]!),
        switchMap(params => this.entityService.getEntityById(params[0]))
      ).subscribe(entity => this.loadFormValues(entity));
    this.subscriptions.push(paramSubscription);
    if(this.id)
      this.title="Modification de "+this.title
    else
      this.title="Ajout de "+this.title
    this.pageInfo.updateTitle(this.title);
    this.getSecteurActiviteAll();
    this.getPaysAll();
    this.afficherCommune();
    this.getFormeJuridiqueAll();
  }

  afficherCommune() {
    this.communeService.afficherCommuneListe().subscribe(
      (data) => {
        this.commune$ = data;
      }
    );
  }

  getFormeJuridiqueAll = () => {
    this.formeJuridique$ = this.formeJuridiqueService.get();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  loadFormValues = (entity: any) => {
    // console.log(entity)
    this.entity = entity;
    this.entityForm.patchValue({idPersonne: entity.idPersonne});
    this.entityForm.patchValue({id: entity.idPersonne});
    this.entityForm.patchValue({sigle: entity.sigle});
    this.entityForm.patchValue({raisonSociale: entity.raisonSociale});
    this.entityForm.patchValue({siteWeb: entity.siteWeb});
    let dateAgrement = new Date(entity.dateAgrement);
    this.entityForm.patchValue({dateAgrement: new NgbDate(
        dateAgrement.getFullYear(), dateAgrement.getMonth()+1, dateAgrement.getDate())});
    let dateCreationPM = new Date(entity.dateCreationPM);
    this.entityForm.patchValue({dateCreationPM: new NgbDate(
        dateCreationPM.getFullYear(), dateCreationPM.getMonth()+1, dateCreationPM.getDate())});
    //Commun
    this.entityForm.patchValue({ifu: entity.ifu});
    this.entityForm.patchValue({mobile1: entity.mobile1});
    this.entityForm.patchValue({mobile2: entity.mobile2});
    this.entityForm.patchValue({fixe1: entity.fixe1});
    this.entityForm.patchValue({fixe2: entity.fixe2});
    this.entityForm.patchValue({bp: entity.bp});
    this.entityForm.patchValue({numRegistre: entity.numRegistre});
    this.entityForm.patchValue({capitalSocial: entity.capitalSocial});
    this.entityForm.patchValue({emailPerso: entity.emailPerso});
    this.entityForm.patchValue({emailPro: entity.emailPro});
    this.entityForm.patchValue({domicile: entity.domicile});
    this.entityForm.patchValue({secteur: entity.secteur});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({commune: entity.commune});
    this.entityForm.patchValue({formeJuridique: entity.formeJuridique});
    this.entityForm.patchValue({codeAgence: entity.codeAgence});
    this.entityForm.patchValue({typeTeneurCompte: entity.typeTeneurCompte.toString()});
    this.entityForm.patchValue({numeroAgrementPersonneMorale: entity.numeroAgrementPersonneMorale});
    this.entityForm.patchValue({numeroOrdreTeneur: entity.numeroOrdreTeneur});
  }

  getSecteurActiviteAll = () => {
    this.secteurService.afficherListe().subscribe(
      (data)=>{
        this.secteurs$=data;
      }
    )
  }

  getPaysAll = () => {
    this.paysService.afficherPaysListe().subscribe(
      (data) => {
        this.payss$ = data;
      }
    );
  }

  callSecteurForm(entity: any) {
    const modalRef = this.modalService.open(SecteurAddEditComponent, {
      backdrop: "static",
      size: "xs"
    });
    if(entity)
    {
      modalRef.componentInstance.entity = entity;
      modalRef.componentInstance.id = entity.idSecteur;
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      this.secteurs$.push(receivedEntry);
      this.entityForm.patchValue({secteur: this.secteurs$.find((o:any) => o.idSecteur == receivedEntry.idSecteur)});
    });
  }

  onSaveEntity = () => {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;

    this.submitting = true;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          //Redirigez vers la liste
          this.router.navigate([`/app/standard/parametre/societedegestion`]);
        })
      )
      .subscribe(statutPersonneSaved => {
        // console.log("Statut Personne = ", statutPersonneSaved);
      });
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let dateAgre: any;
    if(this.entityForm.controls.dateAgrement.value)
    {
      dateAgre = new Date(
        this.entityForm.controls.dateAgrement.value.year,
        this.entityForm.controls.dateAgrement.value.month-1,
        this.entityForm.controls.dateAgrement.value.day+1);
    }
    let dateCreate: any;
    if(this.entityForm.controls.dateCreationPM.value)
    {
      dateCreate = new Date(
        this.entityForm.controls.dateCreationPM.value.year,
        this.entityForm.controls.dateCreationPM.value.month-1,
        this.entityForm.controls.dateCreationPM.value.day+1);
    }
    let personne = {
      ...this.entityForm.value,
      dateAgrement: dateAgre,
      dateCreationPM:dateCreate
    }
    console.log(personne)
    return this.id
      ? this.entityService.update(personne)
      : this.entityService.create(personne);
  }
}

