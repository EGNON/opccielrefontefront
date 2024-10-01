import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {PersonnePhysique} from "../../../../crm/models/personne/personne.physique.model";
import {Qualite} from "../../../../crm/models/qualite.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {ResponseModel} from "../../../../crm/models/table.model";
import {UniqueNumCpteDepositValidators} from "../../../../validators/unique-num-cpte-deposit-validators";
import {NgbDate, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {DegreService} from "../../../../crm/services/degre.service";
import {ProfessionService} from "../../../../crm/services/profession.service";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {ModeetablissementService} from "../../../../crm/services/modeetablissement.service";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import { ModeetablissementAddEditComponent } from "../../../../crm/pages/modeetablissement/modeetablissement-add-edit/modeetablissement-add-edit.component";
import {ProfessionAddEditComponent} from "../../profession/profession-add-edit/profession-add-edit.component";
import {SecteurAddEditComponent} from "../../secteur/secteur-add-edit/secteur-add-edit.component";
import {DegreAddEditComponent} from "../../degre/degre-add-edit/degre-add-edit.component";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {StatutPersonne} from "../../../../crm/models/statut.personne.model";
import {SoustypeclientService} from "../../../services/revuecompte/soustypeclient.service";
import {CategorieclientService} from "../../../services/revuecompte/categorieclient.service";

@Component({
  selector: 'app-morale-details',
  templateUrl: './morale-details.component.html',
  styleUrl: './morale-details.component.scss'
})
export class MoraleDetailsComponent {

  /********************************** showForm  **********************************
   * showForm = 0 pour la liste
   * showForm = 1 pour l'ajout et la modification
   * showForm = 2 pour l'affichage des détails
   * showForm = 3 pour la suppression
   * **/

  @Input('updateParentModel') updateParentModel: (
    part: Partial<PersonnePhysique>,
    isFormValid: boolean
  ) => void;
  _qualite: Qualite;
  qualite: string;
  title: string;
  form: FormGroup;
  private subscriptions: Subscription[] = [];

  commonForm = {};
  pmForm = {};
  prospectForm = {};
  actionnaireForm = {};
  distributeurForm = {};

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entities: any[] = [];
  docs: Document[] = [];
  secteurs$: any;
  modeEtablissement$: any;
  professions$: any;
  degres$: Observable<ResponseModel<any>>;
  payss$: any;
  sousTypeClient$: any;
  categorieClient$: any;
  typeDocuments$: any;
  distributeurs$: any;
  personnels$: any;

  selectedFiles: { [k: string]: any } = {};
  message: string[] = [];

  fileInfos?: Observable<any>;
  etatConversion: boolean = false;
  formData: FormData = new FormData();
  files: File[] = [];

  @Output() showForm: EventEmitter<number> = new EventEmitter<number>();

  voyelles: string[] = [];

  constructor(
    private uniqueNumCpteDepositValidators: UniqueNumCpteDepositValidators,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private element: ElementRef,
    private entityService: PersonneMoraleService,
    private personneService: PersonneService,
    private degreService: DegreService,
    private professionService: ProfessionService,
    private secteurService: SecteurService,
    private sousTypeClientService: SoustypeclientService,
    private categorieClientService: CategorieclientService,
    private paysService: PaysService,
    private qualiteService: QualiteService,
    private modeEtablissementService: ModeetablissementService,
    private statutPersonneService: StatutPersonneService,
    private uploadService: FileUploadService,
    private typeDocService: TypeDocumentService,
    private personnelService: PersonnelService,
    private parserFormatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private pageInfo: PageInfoService) {
  }

  ngOnDestroy(): void {
    this.showForm.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    const $tab = $('a[id*="simple-tab"].active');
    if(typeof $tab !== undefined)
    {
      this.voyelles = ['a', 'e', 'y', 'u', 'i', 'o'];
      this.fileInfos = this.uploadService.getFiles();
      this.submitted = false;
      this.commonForm = {
        //Champs communs
        id: [this.id],
        idPersonne: [this.id],
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
        numeroCpteDeposit: [
          null,
          [Validators.required], //sync validators
          [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(this.id)] //async validators
        ],
        paysResidence: [null, Validators.required],
        domicile: [null],
        nomContact: [null, Validators.required],
        prenomContact: [null, Validators.required],
        telContact: [null, Validators.required],
        emailContact: [null, [Validators.required, Validators.email]],
        titreContact: [null, Validators.required],
        estConvertie: [this.etatConversion],
        statutPersonnes: this.fb.array([this.createStatutPersonneForm()]),
        sousTypeClient: [null],
        categorieClient: [null]
      };
      this.pmForm = {
        //Champs PersonneMorale
        sigle: [null, Validators.required],
        raisonSociale: [null, Validators.required],
        siteWeb: [null],
      };

      this.form = this.fb.group(
        {
          ...this.commonForm,
          ...this.pmForm,
        }
      );
      this._qualite = {
        id: +$tab.attr("data-id")!,
        idQualite: +$tab.attr("data-id")!,
        libelleQualite: $tab[0].textContent
      };
      this.qualite = $tab[0].textContent.toLowerCase();
      if(!this.id || (this.id && this.etatConversion))
      {
        this.statutPersonnes.clear();
        const statutForm = this.createStatutPersonneForm();
        statutForm.patchValue({
          idStatutPersonne: {
            idPersonne: null,
            idQualite: this._qualite.idQualite
          },
          personne: null,
          qualite: this._qualite,
          personnel: null
        });
        this.statutPersonnes.push(statutForm);
      }

      if(this.id)
      {
        this.title = "Modification de " + this._qualite.libelleQualite.toLowerCase();
        this.pageInfo.updateTitle(this.title);
        this.entityService.getEntityById(this.id).subscribe((entity) => {
          this.loadFormValues(entity, this._qualite);
        });
      }
      else
      {
        this.title = "Ajout de " + this._qualite.libelleQualite.toLowerCase();
        this.pageInfo.updateTitle(this.title);
      }

      //Afficher ou cacher certains champs en fonction de la qualité
      this.addOrRemoveFieldsAndValidators(this._qualite.libelleQualite.toLowerCase());

      this.getPersonnesAll('distributeur');
      this.getDegresAll();
      this.getProfessionAll();
      this.getSecteurActiviteAll();
      this.getPaysAll();
      this.getTypeDocumentsAll();
      this.getPersonnelsAll();
      this.getModeEtablissement();
      this.getSousTypeClientAll();
      this.getCategorieClientAll();
    }
  }

  get f() { return this.form.controls; }

  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get documents(): FormArray { return <FormArray>this.form.get('documents')}

  get statutPersonnes(): FormArray { return <FormArray>this.form.get('statutPersonnes')}

  onAddStatutPersonne(data: any)
  {
    this.statutPersonnes.push(this.createItem(data));
  }

  onAddFile() {
    this.documents.push(this.createItem({
      idDoc: null,
      dateValidite: null,
      dateRattachement: null,
      chemin: null,
      nomDoc: null,
      extensionDoc: null,
      typeDocument: null,
      compteRendu: null,
      personne: null
    }));
  }

  onDeleteFile(index: number)
  {
    this.documents.removeAt(index);
  }

  selectFiles(index: number, event: any): void {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.selectedFiles[`file${index}`] = file;
      this.files.push(file);
      const filename = file.name;

      let last_dot = filename.lastIndexOf('.');
      let ext = filename.slice(last_dot + 1);
      let name = filename.slice(0, last_dot);

      let doc: any = {
        ...this.documents.controls[index].value,
        dateRattachement: new Date(),
        nomDoc: name,
        // file: file,
        extensionDoc: ext
      };
      this.documents.controls[index].patchValue(doc);
    }
  }

  getFileName(file: any)
  {
    let filename: string = '';
    if(file)
    {
      const reader = new FileReader();
      filename = file.name

      let last_dot = filename.lastIndexOf('.');
      // let ext = filename.slice(last_dot + 1);
      filename = filename.slice(0, last_dot);
    }

    return filename;
  }

  getFileExtension(file: any)
  {
    let result: string = '';
    if(file)
    {
      const reader = new FileReader();
      const filename = file.name

      let last_dot = filename.lastIndexOf('.');
      result = filename.slice(last_dot + 1);
    }

    return result;
  }

  retourAlaListe() {
    this.showForm.emit(0);
  }

  onClick(id: string) {
    document.getElementById(id)?.click();
  }

  addOrRemoveFieldsAndValidators(qualite: string)
  {
    if(qualite === "prospect" || (qualite !== "prospect" && qualite !== "actionnaire"))
    {
      //numeroCpteDeposit
      this.form.controls["numeroCpteDeposit"].setErrors(null);
      this.form.controls["numeroCpteDeposit"].clearValidators();
      this.form.controls["numeroCpteDeposit"].clearAsyncValidators();
      this.form.controls["numeroCpteDeposit"].updateValueAndValidity();

      //categorie client
      this.form.controls["categorieClient"].setErrors(null);
      this.form.controls["categorieClient"].clearValidators();
      this.form.controls["categorieClient"].updateValueAndValidity();

      //sous type client
      this.form.controls["sousTypeClient"].setErrors(null);
      this.form.controls["sousTypeClient"].clearValidators();
      this.form.controls["sousTypeClient"].updateValueAndValidity();

      /*//Pere
      this.form.controls["nomPere"].setErrors(null);
      this.form.controls["nomPere"].clearValidators();
      this.form.controls["nomPere"].updateValueAndValidity();

      this.form.controls["prenomsPere"].setErrors(null);
      this.form.controls["prenomsPere"].clearValidators();
      this.form.controls["prenomsPere"].updateValueAndValidity();

      this.form.controls["dateNaissancePere"].setErrors(null);
      this.form.controls["dateNaissancePere"].clearValidators();
      this.form.controls["dateNaissancePere"].updateValueAndValidity();

      this.form.controls["paysPere"].setErrors(null);
      this.form.controls["paysPere"].clearValidators();
      this.form.controls["paysPere"].updateValueAndValidity();

      //Mere
      this.form.controls["nomMere"].setErrors(null);
      this.form.controls["nomMere"].clearValidators();
      this.form.controls["nomMere"].updateValueAndValidity();

      this.form.controls["prenomsMere"].setErrors(null);
      this.form.controls["prenomsMere"].clearValidators();
      this.form.controls["prenomsMere"].updateValueAndValidity();

      this.form.controls["dateNaissanceMere"].setErrors(null);
      this.form.controls["dateNaissanceMere"].clearValidators();
      this.form.controls["dateNaissanceMere"].updateValueAndValidity();

      this.form.controls["paysMere"].setErrors(null);
      this.form.controls["paysMere"].clearValidators();
      this.form.controls["paysMere"].updateValueAndValidity();

      //Profession
      this.form.controls["profession"].setErrors(null);
      this.form.controls["profession"].clearValidators();
      this.form.controls["profession"].updateValueAndValidity();*/
    }
  }

  createStatutPersonneForm() {
    return this.fb.group({
      idStatutPersonne: new FormGroup({
        idPersonne: new FormControl(null),
        idQualite: new FormControl(null),
      }),
      personne: new FormControl(null),
      personnel: new FormControl(null),
      qualite: new FormControl(null),
    });
  }

  loadFormValues(entity: any, qualite: Qualite)
  {
    if(this.etatConversion)
      entity.estConvertie = this.etatConversion;
    this.entity = entity;
    this.form.patchValue({idPersonne: entity.idPersonne});
    this.form.patchValue({id: entity.idPersonne});
    this.form.patchValue({estConvertie: entity.estConvertie});
    this.form.patchValue({sigle: entity.sigle});
    this.form.patchValue({raisonSociale: entity.raisonSociale});
    this.form.patchValue({siteWeb: entity.siteWeb});
    //Commun
    this.form.patchValue({ifu: entity.ifu});
    this.form.patchValue({mobile1: entity.mobile1});
    this.form.patchValue({mobile2: entity.mobile2});
    this.form.patchValue({fixe1: entity.fixe1});
    this.form.patchValue({fixe2: entity.fixe2});
    this.form.patchValue({bp: entity.bp});
    this.form.patchValue({emailPerso: entity.emailPerso});
    this.form.patchValue({emailPro: entity.emailPro});
    this.form.patchValue({domicile: entity.domicile});
    this.form.patchValue({numeroPiece: entity.numeroPiece});
    this.form.patchValue({typePiece: entity.typePiece});
    let dateExpirationPiece = new Date(entity.dateExpirationPiece);
    this.form.patchValue({dateExpirationPiece: new NgbDate(
        dateExpirationPiece.getFullYear(), dateExpirationPiece.getMonth()+1, dateExpirationPiece.getDate())});
    this.form.patchValue({modeEtablissement: entity.modeEtablissement});
    this.form.patchValue({secteur: entity.secteur});
    this.form.patchValue({degre: entity.degre});
    this.form.patchValue({distributeur: entity.distributeur});
    this.form.patchValue({paysResidence: entity.paysResidence});
    this.form.patchValue({quartier: entity.quartier});
    this.form.patchValue({nomContact: entity.nomContact});
    this.form.patchValue({prenomContact: entity.prenomContact});
    this.form.patchValue({telContact: entity.telContact});
    this.form.patchValue({emailContact: entity.emailContact});
    this.form.patchValue({titreContact: entity.titreContact});
    this.form.patchValue({numeroCpteDeposit: entity.numeroCpteDeposit});
    this.form.patchValue({sousTypeClient: entity.sousTypeClient});
    this.form.patchValue({categorieClient: entity.categorieClient});

    //Chargements des statuts
    const statuts = entity.statutPersonnes;
    this.statutPersonnes.clear();
    statuts.forEach((statut) => {
      const statutForm = this.createStatutPersonneForm();
      statutForm.patchValue({
        ...statut,
        idStatutPersonne: {
          idPersonne: entity.idPersonne,
          idQualite: statut.qualite.idQualite
        }
      });
      this.statutPersonnes.push(statutForm);
    });
  }
  getSousTypeClientAll = () => {
    this.sousTypeClientService.afficherAutresTypePersonne().subscribe(
      (data) => {
        this.sousTypeClient$ = data.data;
      }
    );
  }
  getCategorieClientAll = () => {
    this.categorieClientService.afficherTous().subscribe(
      (data) => {
        this.categorieClient$ = data.data;
      }
    );
  }
  getPersonnelsAll()
  {
    this.personnelService.afficherPersonnelSelonEstCommercial().subscribe(
      (data)=>{
        this.personnels$=data;
      }
    )
  }

  getModeEtablissement()
  {
    this.modeEtablissementService.afficherListe().subscribe(
      (data)=>{
        this.modeEtablissement$=data;
      }
    )
  }

  getTypeDocumentsAll()
  {
    this.typeDocuments$ = this.typeDocService.afficherTous();
  }

  getPersonnesAll(qualite: any = null)
  {
    this.distributeurs$ = this.personneService.afficherPersonneSelonQualite(qualite);
  }

  getDegresAll = () => {
    this.degres$ = this.degreService.get();
  }

  getProfessionAll = () => {
    this.professionService.afficherListe().subscribe(
      (data)=>{
        this.professions$=data;
      }
    )
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

  callModeForm(entity: any) {
    const modalRef = this.modalService.open(ModeetablissementAddEditComponent, {
      backdrop: "static",
      size: "xs"
    });
    if(entity)
    {
      modalRef.componentInstance.entity = entity;
      modalRef.componentInstance.id = entity.idModeEtablissement;
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      this.modeEtablissement$.push(receivedEntry);
      this.form.patchValue({modeEtablissementDto: this.modeEtablissement$.find((o:any) => o.idModeEtablissement == receivedEntry.idModeEtablissement)});
    });
  }

  callProfessionForm(entity: any) {
    const modalRef = this.modalService.open(ProfessionAddEditComponent, {
      backdrop: "static",
      size: "xs"
    });
    if(entity)
    {
      modalRef.componentInstance.entity = entity;
      modalRef.componentInstance.id = entity.idProf;
    }
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      this.professions$.push(receivedEntry);
      this.form.patchValue({profession: this.professions$.find((o:any) => o.idProf == receivedEntry.idProf)});
    });
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
      this.form.patchValue({secteur: this.secteurs$.find((o:any) => o.idSecteur == receivedEntry.idSecteur)});
      // this.secteurs$ = this.secteurs$.pipe(
      //   tap((data: any) => this.form.patchValue({secteur: data.find((o:any) => o.idSecteur == receivedEntry.idSecteur)})),
      // );
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
      this.degres$ = this.degres$.pipe(
        tap((resp) => this.form.patchValue({degre: resp.data.find((o:any) => o.idDegre == receivedEntry.idDegre)})),
      );
    });
  }

  onSaveEntity = () => {
    this.isLoading = true;
    this.submitted = true;
    this.submitting = true;

    if(this.form.invalid) return;

    const sb = this.saveEntity()
      .pipe(
        filter(res => res != null && res.idPersonne > 0),
        switchMap(res => {
          const statuts: StatutPersonne[] = this.statutPersonnes.value;
          const statut: any = statuts.find(statut => statut.qualite.libelleQualite.toLowerCase() === this.qualite);
          // console.log("Statuts actuels === ", statuts.find(statut => statut.qualite.libelleQualite.toLowerCase() === this.qualite));
          //Enregistrement des statuts de personne
          return this.statutPersonneService.ajouterStatutSelonQualite(
            {
              ...statut,
              personne: {idPersonne: res.idPersonne}
            },
            this.qualite);
        }),
        catchError((err) => {
          this.submitting = false;
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          this.submitting = false;

          //Redirigez vers la liste
          this.showForm.emit(0);
          //Mettre à jour le titre
          this.title = "Liste des " + this.qualite + (this.qualite[this.qualite.length-1] === 's' ? '' : 's');
          this.pageInfo.updateTitle(this.title);
        })
      )
      .subscribe(statutPersonneSaved => {
        // console.log("Statut Personne = ", statutPersonneSaved);
      });
    this.subscriptions.push(sb);
  }

  saveEntity() {
    return this.id
      ? this.entityService.update(this.form.value)
      : this.entityService.create(this.form.value);
  }

  ngAfterViewInit(): void {
    var $select2 = $(".select2");
    $select2.select2();

    // Update form control value on Select2 change
    $select2.on("change", (event: any) => {
      const value = $(event.target).val();
      this.form.controls["modeEtablissementDto"].setValue(value);
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
}
