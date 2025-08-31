import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {DegreService} from "../../../../crm/services/degre.service";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {SecteurAddEditComponent} from "../../secteur/secteur-add-edit/secteur-add-edit.component";
import {DegreAddEditComponent} from "../../degre/degre-add-edit/degre-add-edit.component";
declare var $:JQueryStatic;
import "select2";
import {UniqueNumCpteDepositValidators} from "../../../../validators/unique-num-cpte-deposit-validators";

@Component({
    selector: 'app-personne-morale-add-edit',
    templateUrl: './personne-morale-add-edit.component.html',
    styleUrls: ['./personne-morale-add-edit.component.scss'],
    standalone: false
})
export class PersonneMoraleAddEditComponent implements OnInit, AfterViewInit, OnDestroy{

  qualite: string;
  id?: string;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entityForm!: FormGroup;
  secteurs$: any;
  degres$: any;
  payss$:any;
  personnels$: any;
  title: string;

  distributeurs$: any;
  private subscriptions: Subscription[] = [];

  etatConversion: boolean = false;

  constructor(
    private modalService: NgbModal,
    private pageInfo: PageInfoService,
    private entityService: PersonneMoraleService,
    private uniqueNumCpteDepositValidators: UniqueNumCpteDepositValidators,
    private personneService: PersonneService,
    private personnelService: PersonnelService,
    private degreService: DegreService,
    private secteurService: SecteurService,
    private paysService: PaysService,
    private qualiteService: QualiteService,
    private statutPersonneService: StatutPersonneService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = "Ajout de ";
    this.submitted = false;
    this.id = this.route.snapshot.params['id'];
    // this.qualite = this.route.snapshot.params['qualite'];
    // if(this.route.parent){
    //   this.route.parent.params.subscribe((params) =>
    //   {
    //     this.qualite = params.qualite;
    //   });
    // }
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idPersonne: [this.id],
        //Champs Personne Morale
        sigle: [null, Validators.required],
        raisonSociale: [null, Validators.required],
        siteWeb: [null],
        //Champs communs
        degre: [null, Validators.required],
        mobile1: [null, Validators.required],
        mobile2: [null],
        fixe1: [null],
        fixe2: [null],
        ifu: [null, Validators.required],
        bp: [null],
        distributeur: [null],
        secteur: [null, Validators.required],
        emailPerso: [null, Validators.email],
        emailPro: [null, Validators.email],
        numeroCpteDeposit: [null, [Validators.required],
          [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(this.id)]],
        paysResidence: [null, Validators.required],
        domicile: [null],
        nomContact: [null, Validators.required],
        prenomContact: [null, Validators.required],
        telContact: [null, Validators.required],
        emailContact: [null, [Validators.required, Validators.email]],
        titreContact: [null, Validators.required],
        estConvertie: [this.etatConversion],
        statutPersonnes: this.fb.array([]),
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
          this.title = "Modification de ";
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

    //Récupération de la valeur de qualité à partir du parent
    const qualiteSubscription = this.route.parent?.paramMap.pipe(
      filter(paramMap => paramMap.has('qualite')),
      map(paramMap => paramMap.get('qualite'))
    ).subscribe(qualite => {
      this.qualite = qualite!;
      this.title += this.qualite[0].toUpperCase() + this.qualite.substr(1).toLowerCase();
      this.pageInfo.updateTitle(this.title);
      if(!this.id || (this.id && this.etatConversion))
      {
        this.onAddStatutPersonne({
          personne: null,
          qualite: {idQualite: null, libelleQualite: this.qualite},
          personnel: null
        });
      }
    });
    if(qualiteSubscription) this.subscriptions.push(qualiteSubscription);
    this.addOrRemoveFieldsAndValidators();
    this.getPersonnelsAll();
    this.getPersonnesAll('distributeur');
    this.getDegresAll();
    this.getSecteurActiviteAll();
    this.getPaysAll();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  addOrRemoveFieldsAndValidators()
  {
    if(this.qualite === "prospect")
    {
      //numeroCpteDeposit
      this.entityForm.controls["numeroCpteDeposit"].setErrors(null);
      this.entityForm.controls["numeroCpteDeposit"].clearValidators();
      this.entityForm.controls["numeroCpteDeposit"].updateValueAndValidity();
    }
  }

  get f() { return this.entityForm.controls; }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get statutPersonnes(): FormArray { return <FormArray>this.entityForm.get('statutPersonnes')}

  onAddStatutPersonne(data: any)
  {
    this.statutPersonnes.push(this.createItem(data));
  }

  loadFormValues = (entity: any) => {
    if(this.etatConversion)
      entity.estConvertie = this.etatConversion;
    this.entity = entity;
    this.entityForm.patchValue({idPersonne: entity.idPersonne});
    this.entityForm.patchValue({id: entity.idPersonne});
    this.entityForm.patchValue({estConvertie: entity.estConvertie});
    this.entityForm.patchValue({sigle: entity.sigle});
    this.entityForm.patchValue({raisonSociale: entity.raisonSociale});
    this.entityForm.patchValue({siteWeb: entity.siteWeb});
    //Commun
    this.entityForm.patchValue({ifu: entity.ifu});
    this.entityForm.patchValue({mobile1: entity.mobile1});
    this.entityForm.patchValue({mobile2: entity.mobile2});
    this.entityForm.patchValue({fixe1: entity.fixe1});
    this.entityForm.patchValue({fixe2: entity.fixe2});
    this.entityForm.patchValue({bp: entity.bp});
    this.entityForm.patchValue({emailPerso: entity.emailPerso});
    this.entityForm.patchValue({emailPro: entity.emailPro});
    this.entityForm.patchValue({domicile: entity.domicile});
    this.entityForm.patchValue({numeroPiece: entity.numeroPiece});
    this.entityForm.patchValue({typePiece: entity.typePiece});
    let dateExpirationPiece = new Date(entity.dateExpirationPiece);
    this.entityForm.patchValue({dateExpirationPiece: new NgbDate(
        dateExpirationPiece.getFullYear(), dateExpirationPiece.getMonth()+1, dateExpirationPiece.getDate())});
    this.entityForm.patchValue({modeEtablissement: entity.modeEtablissement});
    this.entityForm.patchValue({secteur: entity.secteur});
    this.entityForm.patchValue({degre: entity.degre});
    this.entityForm.patchValue({distributeur: entity.distributeur});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({quartier: entity.quartier});
    this.entityForm.patchValue({nomContact: entity.nomContact});
    this.entityForm.patchValue({prenomContact: entity.prenomContact});
    this.entityForm.patchValue({telContact: entity.telContact});
    this.entityForm.patchValue({emailContact: entity.emailContact});
    this.entityForm.patchValue({titreContact: entity.titreContact});
    this.entityForm.patchValue({numeroCpteDeposit: entity.numeroCpteDeposit});

    //Chargements des statuts
    if(entity.statutPersonnes != null && entity.statutPersonnes.length > 0)
    {
      let cpt = 0;
      for (let i = 0; i < entity.statutPersonnes.length; i++) {
        if(this.qualite == entity.statutPersonnes[i].qualite.libelleQualite)
        {
          this.statutPersonnes.push(this.createItem(entity.statutPersonnes[i]));
          this.statutPersonnes.controls[cpt].patchValue(entity.statutPersonnes[i]);
          cpt++;
        }
        else
        {
          if(entity.statutPersonnes[i].personnel != null && this.etatConversion)
          {
            this.statutPersonnes.controls[cpt].patchValue(entity.statutPersonnes[i]);
            cpt++;
          }
        }
      }
    }
  }

  getPersonnelsAll()
  {
    // const sb = this.personnelService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.personnelService.fetch();
    // this.personnels$ = this.personnelService.items$;
    this.personnelService.afficherPersonnelSelonEstCommercial().subscribe(
      (data)=>{
        this.personnels$=data;
      }
    )
  }

  getPersonnesAll(qualite: any)
  {
    this.distributeurs$ = this.personneService.afficherPersonneSelonQualite(qualite);
  }

  getDegresAll = () => {
    this.degreService.afficherTous().subscribe(
      (data)=>{
        this.degres$=data;
      }
    );
  }

  getSecteurActiviteAll = () => {
    // const sb = this.secteurService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.secteurService.fetch();
    // this.secteurs$ = this.secteurService.items$;
    this.secteurService.afficherListe().subscribe(
      (data)=>{
        this.secteurs$=data;
      }
    )
  }

  getPaysAll = () => {
    // const sb = this.paysService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.paysService.fetch();
    // this.payss$ = this.paysService.items$;
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

  callDegreForm(entity: any) {
    const modalRef = this.modalService.open(DegreAddEditComponent, {
      backdrop: "static",
      size: "xs"
    });
    if(entity)
    {
      modalRef.componentInstance.entity = entity;
      modalRef.componentInstance.id = entity.idDegre;
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      this.degres$.push(receivedEntry);
      this.entityForm.patchValue({degre: this.degres$.find((o:any) => o.idDegre == receivedEntry.idDegre)});
    });
  }

  onSaveEntity = () => {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;

    this.submitting = true;
    const sb = this.saveEntity()
      .pipe(
        filter(res => res != null && res.idPersonne > 0),
        switchMap(res => {
          //Enregistrement des statuts de personne
          return this.statutPersonneService.ajouterStatutSelonQualite({...this.statutPersonnes.controls[0].value, personne: res}, this.qualite);
        }),
        catchError((err) => {
          this.submitting = false;
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          //Redirigez vers la liste
          this.router.navigate([`/app/standard/parametre/personne/morale/${this.qualite}`]);
        })
      )
      .subscribe(statutPersonneSaved => {
        // console.log("Statut Personne = ", statutPersonneSaved);
      });
    this.subscriptions.push(sb);
  }

  saveEntity() {
    return this.id
      ? this.entityService.update(this.entityForm.value)
      : this.entityService.create(this.entityForm.value);
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }
}
