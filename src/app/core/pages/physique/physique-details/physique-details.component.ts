import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {catchError, filter, finalize, map} from "rxjs/operators";
import {BehaviorSubject, Observable, of, Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  ModeetablissementAddEditComponent
} from "../../../../crm/pages/modeetablissement/modeetablissement-add-edit/modeetablissement-add-edit.component";
import {ProfessionAddEditComponent} from "../../profession/profession-add-edit/profession-add-edit.component";
import {SecteurAddEditComponent} from "../../secteur/secteur-add-edit/secteur-add-edit.component";
import {DegreAddEditComponent} from "../../degre/degre-add-edit/degre-add-edit.component";
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
import {ResponseModel} from "../../../../crm/models/table.model";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {PersonnePhysique} from "../../../../crm/models/personne/personne.physique.model";
import {Qualite} from "../../../../crm/models/qualite.model";
declare var $:JQueryStatic;
import "select2";
import {UniqueNumCpteDepositValidators} from "../../../../validators/unique-num-cpte-deposit-validators";
import {StatutPersonne} from "../../../../crm/models/statut.personne.model";
import {LangueService} from "../../../services/langue.service";
import {SoustypeclientService} from "../../../services/revuecompte/soustypeclient.service";
import {CategorieclientService} from "../../../services/revuecompte/categorieclient.service";

@Component({
    selector: 'app-physique-details',
    templateUrl: './physique-details.component.html',
    styleUrl: './physique-details.component.scss',
    standalone: false
})
export class PhysiqueDetailsComponent implements OnInit, AfterViewInit, OnDestroy{

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
  phForm = {};
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
  langue$: any;
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

  currentTabIndex$: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(
    private uniqueNumCpteDepositValidators: UniqueNumCpteDepositValidators,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private element: ElementRef,
    private entityService: PersonnePhysiqueService,
    private personneService: PersonneService,
    private degreService: DegreService,
    private sousTypeClientService: SoustypeclientService,
    private categorieClientService: CategorieclientService,
    private professionService: ProfessionService,
    private secteurService: SecteurService,
    private paysService: PaysService,
    private langueService: LangueService,
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
        id: [null],
        idPersonne: [null],
        secteur: [null],
        degre: [null, Validators.required],
        mobile1: [null, Validators.required],
        mobile2: [null],
        fixe1: [null],
        fixe2: [null],
        ifu: [null],
        bp: [null],
        typePiece: [null],
        numeroPiece: [null],
        dateExpirationPiece: [null],
        modeEtablissement: [null],
        modeEtablissementDto: [null],
        emailPerso: [null, Validators.email],
        emailPro: [null, Validators.email],
        domicile: [null],
        distributeur: [null],
        documents: this.fb.array([]),
        // statutPersonnes: this.fb.array([]),
        statutPersonnes: this.fb.array([this.createStatutPersonneForm()]),
        estsgi: [false],
        ppe1: [false],
        ppe2: [false],
        ppe3: [false],
        ppe4: [false],
      };
      this.phForm = {
        //Champs PersonnePhysique
        nom: [null, Validators.required],
        prenom: [null, Validators.required],
        sexe: [null, Validators.required],
        dateNaissance: [null, Validators.required],
        civilite: [null, Validators.required],
        lieuTravail: [null],
        autresRevenus: [0],
        periodicite: [null],
        statutMatrimonial: [null, Validators.required],
        nbrEnfant: [0],
        nbrPersonneACharge: [0],
        paysResidence: [null],
        nomEmployeur: [null],
        adressePostaleEmp: [null],
        adresseGeoEmp: [null],
        telEmp: [null],
        emailEmp: [null, Validators.email],
        nomPere: [null, Validators.required],
        prenomsPere: [null, Validators.required],
        dateNaissancePere: [null],
        paysPere: [null],
        nomMere: [null, Validators.required],
        prenomsMere: [null, Validators.required],
        dateNaissanceMere: [null],
        paysMere: [null],
        nomConjoint: [null],
        prenomConjoint: [null],
        dateNaissanceConjoint: [null],
        paysConjoint: [null],
        origineFonds: [null],
        transactionEnvisagee: [null],
        immobilier: [null],
        autresBiens: [null],
        surfaceTotale: [0],
        salaire: [0],
        numeroCpteDeposit: [
          null,
          [Validators.required], //sync validators
          [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(this.id)] //async validators
        ],
        profession: [null, Validators.required],
        secteurEmp: [null],
        paysNationalite: [null, Validators.required],
        langue: [null],
        teint: [null],
        exposeMotif: [null],
        sousTypeClient: [null],
        categorieClient: [null],
      };

      this.form = this.fb.group(
        {
          ...this.commonForm,
          ...this.phForm,
        }
      );
      this._qualite = {
        id: +$tab.attr("data-id")!,
        idQualite: +$tab.attr("data-id")!,
        libelleQualite: $tab[0].textContent
      };
      this.qualite = $tab[0].textContent.toLowerCase();
      // console.log("Tab === ", $tab[0].textContent);
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
          console.log("entity=",entity)
        });
      }
      else
      {
        this.title = "Ajout de " + this._qualite.libelleQualite.toLowerCase();
        this.pageInfo.updateTitle(this.title);
      }

      //Afficher ou cacher certains champs en fonction de la qualité
      this.addOrRemoveFieldsAndValidators(this._qualite.libelleQualite.toLowerCase());

      this.getPersonnesAll('distributeurs');
      this.getDegresAll();
      this.getProfessionAll();
      this.getSecteurActiviteAll();
      this.getPaysAll();
      this.getLangueAll();
      this.getTypeDocumentsAll();
      this.getPersonnelsAll();
      this.getModeEtablissement();
      this.getCategorieClientAll();
      this.getSousTypeClientAll();
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
      numeroPiece: null,
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
    if(qualite === "prospect" || (qualite !== "prospect" && qualite !== "actionnaires"))
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

      //Pere
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
      this.form.controls["profession"].updateValueAndValidity();

      //statutMatrimonial
      this.form.controls["statutMatrimonial"].setErrors(null);
      this.form.controls["statutMatrimonial"].clearValidators();
      this.form.controls["statutMatrimonial"].updateValueAndValidity();

      //paysNationalite
      this.form.controls["paysNationalite"].setErrors(null);
      this.form.controls["paysNationalite"].clearValidators();
      this.form.controls["paysNationalite"].updateValueAndValidity();

      //dateNaissance
      this.form.controls["dateNaissance"].setErrors(null);
      this.form.controls["dateNaissance"].clearValidators();
      this.form.controls["dateNaissance"].updateValueAndValidity();

      //degre
      this.form.controls["degre"].setErrors(null);
      this.form.controls["degre"].clearValidators();
      this.form.controls["degre"].updateValueAndValidity();
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
    // console.log("entity === ", entity);
    if(this.etatConversion)
      entity.estConvertie = this.etatConversion;
    this.entity = entity;
    this.form.patchValue({id: this.id});
    this.form.patchValue({idPersonne: entity.idPersonne});
    this.form.patchValue({estConvertie: entity.estConvertie});
    this.form.patchValue({civilite: entity.civilite});
    this.form.patchValue({statutMatrimonial: entity.statutMatrimonial});
    this.form.patchValue({nom: entity.nom});
    this.form.patchValue({prenom: entity.prenom});
    this.form.patchValue({sexe: entity.sexe});
    this.form.patchValue({teint: entity.teint});
    this.form.patchValue({exposeMotif: entity.exposeMotif});
    this.form.patchValue({langue: entity.langue});
    let dateNaissance = new Date(entity.dateNaissance);
    this.form.patchValue({dateNaissance: dateNaissance});
    this.form.patchValue({dateNaissance: new NgbDate(
        dateNaissance.getFullYear(), dateNaissance.getMonth()+1, dateNaissance.getDate())});
    this.form.patchValue({paysNationalite: entity.paysNationalite});
    this.form.patchValue({modeEtablissementDto: entity.modeEtablissementDto});
    this.form.patchValue({profession: entity.profession});
    this.form.patchValue({nbrEnfant: entity.nbrEnfant});
    this.form.patchValue({nbrPersonneACharge: entity.nbrPersonneACharge});
    this.form.patchValue({origineFonds: entity.origineFonds});
    this.form.patchValue({transactionEnvisagee: entity.transactionEnvisagee});
    this.form.patchValue({immobilier: entity.immobilier});
    this.form.patchValue({autresBiens: entity.autresBiens});
    this.form.patchValue({surfaceTotale: entity.surfaceTotale});
    this.form.patchValue({salaire: entity.salaire});
    this.form.patchValue({numeroCpteDeposit: entity.numeroCpteDeposit});
    this.form.patchValue({lieuTravail: entity.lieuTravail});
    this.form.patchValue({autresRevenus: entity.autresRevenus});
    this.form.patchValue({periodicite: entity.periodicite});
    if(this.qualite != "prospect")
    {
      //Pere
      this.form.patchValue({nomPere: entity.nomPere});
      this.form.patchValue({prenomsPere: entity.prenomsPere});
      let dateNaissPere = new Date(entity.dateNaissancePere);
      this.form.patchValue({dateNaissancePere: new NgbDate(
          dateNaissPere.getFullYear(), dateNaissPere.getMonth()+1, dateNaissPere.getDate())});
      this.form.patchValue({paysPere: entity.paysPere});
      //Mere
      this.form.patchValue({nomMere: entity.nomMere});
      this.form.patchValue({prenomsMere: entity.prenomsMere});
      let dateNaissMere = new Date(entity.dateNaissanceMere);
      this.form.patchValue({dateNaissanceMere: new NgbDate(
          dateNaissMere.getFullYear(), dateNaissMere.getMonth()+1, dateNaissMere.getDate())});
      this.form.patchValue({paysMere: entity.paysMere});
      //Conjoint
      this.form.patchValue({nomConjoint: entity.nomConjoint});
      this.form.patchValue({prenomConjoint: entity.prenomConjoint});
      let dateNaissConjoint = new Date(entity.dateNaissanceConjoint);
      this.form.patchValue({dateNaissanceConjoint: new NgbDate(
          dateNaissConjoint.getFullYear(), dateNaissConjoint.getMonth()+1, dateNaissConjoint.getDate())});
      this.form.patchValue({paysConjoint: entity.paysConjoint});
      //Employeur
      this.form.patchValue({nomEmployeur: entity.nomEmployeur});
      this.form.patchValue({adressePostaleEmp: entity.adressePostaleEmp});
      this.form.patchValue({adresseGeoEmp: entity.adresseGeoEmp});
      this.form.patchValue({telEmp: entity.telEmp});
      this.form.patchValue({emailEmp: entity.emailEmp});
      this.form.patchValue({secteurEmp: entity.secteurEmp});
      // let dateExpirationPiece = new Date(entity.dateExpirationPiece);
      // this.form.patchValue({dateExpirationPiece: new NgbDate(
      //     dateExpirationPiece.getFullYear(), dateExpirationPiece.getMonth()+1, dateExpirationPiece.getDate())});
    }
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
    // this.form.patchValue({numeroPiece: entity.numeroPiece});
    // this.form.patchValue({typePiece: entity.typePiece});
    this.form.patchValue({modeEtablissement: entity.modeEtablissement});
    this.form.patchValue({secteur: entity.secteur});
    this.form.patchValue({degre: entity.degre});
    this.form.patchValue({distributeur: entity.distributeur});
    this.form.patchValue({paysResidence: entity.paysResidence});
    this.form.patchValue({quartier: entity.quartier});
    this.form.patchValue({sousTypeClient: entity.sousTypeClient});
    this.form.patchValue({categorieClient: entity.categorieClient});

    //SGI
    this.form.patchValue({estsgi: entity.estsgi});

    //PPE
    this.form.patchValue({ppe1: entity.ppe1});
    this.form.patchValue({ppe2: entity.ppe2});
    this.form.patchValue({ppe3: entity.ppe3});
    this.form.patchValue({ppe4: entity.ppe4});

    //Chargements des statuts
    const statuts = entity.statutPersonnes;
    this.statutPersonnes.clear();
    statuts.forEach((statut) => {
      /*if(qualite.libelleQualite == statut.qualite.libelleQualite) {
        const statutForm = this.createStatutPersonneForm();
        statutForm.patchValue(statut);
        this.statutPersonnes.push(statutForm);
      }*/
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

    //Chargement des documents existants
    if(entity.documents != null && entity.documents.length > 0)
    {
      let documents = entity.documents.sort((a:any,b:any) => a.idDoc - b.idDoc);
      for (let i = 0; i < documents.length; i++) {
        this.files[i] = new File([new Blob()], documents[i].nomDoc + "." + documents[i].extensionDoc);
        this.documents.push(this.createItem({...documents[i], file: null}));
        this.documents.controls[i].patchValue({...documents[i], file: null});
      }
    }
  }

  getPersonnelsAll()
  {
    this.personnelService.afficherPersonnelSelonEstCommercial().subscribe(
      (data)=>{
        this.personnels$ = data;
      }
    )
  }

  getModeEtablissement()
  {
    this.modeEtablissementService.afficherListe().subscribe(
      (data)=>{
        this.modeEtablissement$ = data;
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

  getLangueAll = () => {
    this.langueService.afficherTous().subscribe(
      (data) => {
        this.langue$ = data.data;
      }
    );
  }
  getSousTypeClientAll = () => {
    this.sousTypeClientService.afficherPersonnePhysique().subscribe(
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
    // console.log("Form === ", this.form);
    // return;
    if(this.form.invalid) return;

    const formdata = new FormData();
    this.files.forEach((file) => { formdata.append('files', file); });

    const sb = this.saveEntity(formdata)
      .pipe(
        filter(res => res != null && res.idPersonne > 0),
        // tap(value => console.log("Résultat === ", value)),
        switchMap(res => {
          const statuts: StatutPersonne[] = this.statutPersonnes.value;
          const statut: any = statuts.find(statut => statut.qualite.libelleQualite.toLowerCase() === this.qualite);
          // console.log("Statuts actuels === ", statuts.find(statut => statut.qualite.libelleQualite.toLowerCase() === this.qualite));
          //Enregistrement des statuts de personne
          console.log(
            {
              ...statut,
              personne: {idPersonne: res.idPersonne}
            },
              this.qualite);
          return this.statutPersonneService.ajouterStatutSelonQualite(
            {
              ...statut,
              personne: {idPersonne: res.idPersonne}
            },
            this.qualite);
        }),
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          //Redirigez vers la liste
          this.showForm.emit(0);
          //Mettre à jour le titre
          this.title = "Liste des " + this.qualite + (this.qualite[this.qualite.length-1] === 's' ? '' : 's');
          this.pageInfo.updateTitle(this.title);
        })
      )
      .subscribe(res => {
        // console.log("Response = ", res);
      });
    this.subscriptions.push(sb);
  }

  saveEntity(formData: any) {
    //Formatage des dates sous le format souhaité
    let dateNaiss: any;
    if(this.form.controls.dateNaissance.value)
    {
      dateNaiss = new Date(
        this.form.controls.dateNaissance.value.year,
        this.form.controls.dateNaissance.value.month-1,
        this.form.controls.dateNaissance.value.day+1);
    }
    let personne = {
      ...this.form.value,
      dateNaissance: dateNaiss
    }

    if(this.qualite !== "prospect") {
      let dateNaissPere: any;
      if (this.form.controls.dateNaissancePere.value)
      {
        dateNaissPere = new Date(
          this.form.controls.dateNaissancePere.value.year,
          this.form.controls.dateNaissancePere.value.month-1,
          this.form.controls.dateNaissancePere.value.day+1);
      }

      let dateNaissMere: any;
      if (this.form.controls.dateNaissanceMere.value)
      {
        dateNaissMere = new Date(
          this.form.controls.dateNaissanceMere.value.year,
          this.form.controls.dateNaissanceMere.value.month-1,
          this.form.controls.dateNaissanceMere.value.day+1);
      }

      let dateNaissConjoint: any;
      if (this.form.controls.dateNaissanceConjoint.value) {
        dateNaissConjoint = new Date(
          this.form.controls.dateNaissanceConjoint.value.year,
          this.form.controls.dateNaissanceConjoint.value.month-1,
          this.form.controls.dateNaissanceConjoint.value.day+1);
      }

      personne = {
        ...personne,
        dateNaissancePere: dateNaissPere,
        dateNaissanceMere: dateNaissMere,
        dateNaissanceConjoint: dateNaissConjoint
      }
    }
    //console.log(personne)
    formData.append("data", JSON.stringify(personne));

    return this.id
      ? this.entityService.updateFn(formData, personne.idPersonne)
      : this.entityService.createFn(formData);
  }

  ngAfterViewInit(): void {
    /*var $tab = $('a[id*="simple-tab"].active');
    this.qualiteService.getItemById(+$tab.attr('data-id')!).subscribe(value => {
      this._qualite = value;
    });*/
    // console.log("Tab === ", $tab.attr('data-id'));

    var $select2 = $(".select2");
    $select2.select2();

    // Update form control value on Select2 change
    $select2.on("change", (event: any) => {
      const value = $(event.target).val();
      this.form.controls["modeEtablissementDto"].setValue(value);
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }

  onCountrySelected($event: any) {
    console.log("EVENT === ", $event);

    return [];
  }
}

/*const uniqueNumCpteDepositValidator: AsyncValidatorFn = (control: AbstractControl<string>) => {
  return new Promise((resolve, reject) => {
    this.personneService.existeSelonNumCpteDeposit(control.value).subscribe((response: any) => {
      resolve(response);
    }, reject);
  });
}*/
