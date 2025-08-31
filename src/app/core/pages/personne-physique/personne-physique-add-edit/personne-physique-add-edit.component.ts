import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {NgbDate, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseModel} from "../../../../crm/models/table.model";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {DegreService} from "../../../../crm/services/degre.service";
import {ProfessionService} from "../../../../crm/services/profession.service";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {ProfessionAddEditComponent} from "../../profession/profession-add-edit/profession-add-edit.component";
import {SecteurAddEditComponent} from "../../secteur/secteur-add-edit/secteur-add-edit.component";
import {DegreAddEditComponent} from "../../degre/degre-add-edit/degre-add-edit.component";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ModeetablissementService} from "../../../../crm/services/modeetablissement.service";
import {
  ModeetablissementAddEditComponent
} from "../../../../crm/pages/modeetablissement/modeetablissement-add-edit/modeetablissement-add-edit.component";
declare var $:JQueryStatic;
import "select2";
import {NumeroCompteDepositaireDirective} from "../numero-compte-depositaire.directive";
import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import {UniqueNumCpteDepositValidators} from "../../../../validators/unique-num-cpte-deposit-validators";
import {NumbersAuthaurization} from "../../../../validators/numbers-authaurization";
// import {NumbersAuthaurization} from "../../../../validators/numbers-authaurization";
@Component({
  selector: 'app-personne-physique-add-edit',
  templateUrl: './personne-physique-add-edit.component.html',
  styleUrls: ['./personne-physique-add-edit.component.scss']
})


export class PersonnePhysiqueAddEditComponent implements OnInit, OnDestroy, AfterViewInit{

  qualite: string;
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entities: any[] = [];
  entityForm!: FormGroup;
  docs: Document[] = [];
  secteurs$: any;
  modeEtablissement$: any;
  professions$: any;
  degres$: Observable<ResponseModel<any>>;
  payss$: any;
  numberAuthaurization:NumbersAuthaurization;
  typeDocuments$: any;
  distributeurs$: any;
  personnels$: any;
  private subscriptions: Subscription[] = [];
  title: string;
  acceptedCharacters: string[] = ['.', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  selectedFiles: { [k: string]: any } = {};
  message: string[] = [];

  fileInfos?: Observable<any>;
  etatConversion: boolean = false;
  formData: FormData = new FormData();
  files: File[] = [];

  constructor(
    private pageInfo: PageInfoService,
    private modalService: NgbModal,
    private element: ElementRef,
    private entityService: PersonnePhysiqueService,
    private personneService: PersonneService,
    private degreService: DegreService,
    private professionService: ProfessionService,
    private secteurService: SecteurService,
    private paysService: PaysService,
    private qualiteService: QualiteService,
    private modeEtablissementService: ModeetablissementService,
    private statutPersonneService: StatutPersonneService,
    private uploadService: FileUploadService,
    private uniqueNumCpteDepositValidators: UniqueNumCpteDepositValidators,
    private typeDocService: TypeDocumentService,
    private personnelService: PersonnelService,
    private parserFormatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}


  ngOnInit() {
    this.title = "Ajout de ";
    this.fileInfos = this.uploadService.getFiles();
    this.submitted = false;
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idPersonne: [this.id],
        //Champs Personne Physique
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
        // numeroCpteDeposit: [null, Validators.required],
        numeroCpteDeposit: [null, [Validators.required],
                                  [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators(this.id)]
                           ],
        profession: [null, Validators.required],
        secteurEmp: [null],
        paysNationalite: [null, Validators.required],
        //Champs communs
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
        statutPersonnes: this.fb.array([]),
        estsgi: [false],
        ppe1: [false],
        ppe2: [false],
        ppe3: [false],
        ppe4: [false],
        estConvertie: [this.etatConversion],
        // quartier: [null]
      },
      // {
      //   validators: [this.uniqueNumCpteDepositValidators.numeroCompteDepositValidators('numeroCpteDepositaire',this.id)]
      // }
    );
    //Récupération de l'object correspondant à id
    const paramSubscription = this.route.paramMap
    .pipe(
      // filter(paramMap => paramMap.has('id')),
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
    ).subscribe((entity) => {this.loadFormValues(entity)
      //console.log(entity)
    });
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
    //Afficher ou cacher certains champs en fonction de la qualité
    this.addOrRemoveFieldsAndValidators();
    this.getPersonnesAll('distributeur');
    this.getDegresAll();
    this.getProfessionAll();
    this.getSecteurActiviteAll();
    this.getPaysAll();
    this.getTypeDocumentsAll();
    this.getPersonnelsAll();
    this.getModeEtablissement();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get documents(): FormArray { return <FormArray>this.entityForm.get('documents')}

  get statutPersonnes(): FormArray { return <FormArray>this.entityForm.get('statutPersonnes')}

  onAddStatutPersonne(data: any)
  {
    this.statutPersonnes.push(this.createItem(data));
  }
  _keyUp(event: any) {
    if (!this.acceptedCharacters.includes(event.key)) {
      event.preventDefault();
    }
    // const pattern = /[0-9\+\-\ ]/;
    // let inputChar = String.fromCharCode(event.key);
    //
    // if (!pattern.test(inputChar)) {
    //   // invalid character, prevent input
    //   event.preventDefault();
    // }



  }
  // @HostListener('keypress', ['$event']) onInput(event: KeyboardEvent): void
  // {
  //   if (!this.acceptedCharacters.includes(event.key)) {
  //     event.preventDefault();
  //   }
  // }
  // verif()
  // {
  //   // @ts-ignore
  //   document.getElementById("numeroCpteDeposit").onkeypress =
  //     function(event) {return this.numberAuthaurization.verif(event);}
  // }
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

  onClick(id: string) {
    document.getElementById(id)?.click();
  }

  addOrRemoveFieldsAndValidators()
  {
    if(this.qualite === "prospect")
    {
      //numeroCpteDeposit
      this.entityForm.controls["numeroCpteDeposit"].setErrors(null);
      this.entityForm.controls["numeroCpteDeposit"].clearValidators();
      this.entityForm.controls["numeroCpteDeposit"].updateValueAndValidity();

      //Pere
      this.entityForm.controls["nomPere"].setErrors(null);
      this.entityForm.controls["nomPere"].clearValidators();
      this.entityForm.controls["nomPere"].updateValueAndValidity();

      this.entityForm.controls["prenomsPere"].setErrors(null);
      this.entityForm.controls["prenomsPere"].clearValidators();
      this.entityForm.controls["prenomsPere"].updateValueAndValidity();

      this.entityForm.controls["dateNaissancePere"].setErrors(null);
      this.entityForm.controls["dateNaissancePere"].clearValidators();
      this.entityForm.controls["dateNaissancePere"].updateValueAndValidity();

      this.entityForm.controls["paysPere"].setErrors(null);
      this.entityForm.controls["paysPere"].clearValidators();
      this.entityForm.controls["paysPere"].updateValueAndValidity();

      //Mere
      this.entityForm.controls["nomMere"].setErrors(null);
      this.entityForm.controls["nomMere"].clearValidators();
      this.entityForm.controls["nomMere"].updateValueAndValidity();

      this.entityForm.controls["prenomsMere"].setErrors(null);
      this.entityForm.controls["prenomsMere"].clearValidators();
      this.entityForm.controls["prenomsMere"].updateValueAndValidity();

      this.entityForm.controls["dateNaissanceMere"].setErrors(null);
      this.entityForm.controls["dateNaissanceMere"].clearValidators();
      this.entityForm.controls["dateNaissanceMere"].updateValueAndValidity();

      this.entityForm.controls["paysMere"].setErrors(null);
      this.entityForm.controls["paysMere"].clearValidators();
      this.entityForm.controls["paysMere"].updateValueAndValidity();

      //Profession
      this.entityForm.controls["profession"].setErrors(null);
      this.entityForm.controls["profession"].clearValidators();
      this.entityForm.controls["profession"].updateValueAndValidity();
    }
  }

  loadFormValues(entity: any)
  {
    if(this.etatConversion)
      entity.estConvertie = this.etatConversion;
    this.entity = entity;
    this.entityForm.patchValue({estConvertie: entity.estConvertie});
    this.entityForm.patchValue({civilite: entity.civilite});
    this.entityForm.patchValue({statutMatrimonial: entity.statutMatrimonial});
    this.entityForm.patchValue({nom: entity.nom});
    this.entityForm.patchValue({prenom: entity.prenom});
    this.entityForm.patchValue({sexe: entity.sexe});
    let dateNaissance = new Date(entity.dateNaissance);
    this.entityForm.patchValue({dateNaissance: dateNaissance});
    // console.log("DATENAISSANCE === ", entity.dateNaissance);
    this.entityForm.patchValue({dateNaissance: new NgbDate(
        dateNaissance.getFullYear(), dateNaissance.getMonth()+1, dateNaissance.getDate())});
    this.entityForm.patchValue({paysNationalite: entity.paysNationalite});
    this.entityForm.patchValue({modeEtablissementDto: entity.modeEtablissementDto});
    this.entityForm.patchValue({profession: entity.profession});
    this.entityForm.patchValue({nbrEnfant: entity.nbrEnfant});
    this.entityForm.patchValue({nbrPersonneACharge: entity.nbrPersonneACharge});
    this.entityForm.patchValue({origineFonds: entity.origineFonds});
    this.entityForm.patchValue({transactionEnvisagee: entity.transactionEnvisagee});
    this.entityForm.patchValue({immobilier: entity.immobilier});
    this.entityForm.patchValue({autresBiens: entity.autresBiens});
    this.entityForm.patchValue({surfaceTotale: entity.surfaceTotale});
    this.entityForm.patchValue({salaire: entity.salaire});
    this.entityForm.patchValue({numeroCpteDeposit: entity.numeroCpteDeposit});
    this.entityForm.patchValue({lieuTravail: entity.lieuTravail});
    this.entityForm.patchValue({autresRevenus: entity.autresRevenus});
    this.entityForm.patchValue({periodicite: entity.periodicite});
    if(this.qualite != "prospect")
    {
      //Pere
      this.entityForm.patchValue({nomPere: entity.nomPere});
      this.entityForm.patchValue({prenomsPere: entity.prenomsPere});
      let dateNaissPere = new Date(entity.dateNaissancePere);
      this.entityForm.patchValue({dateNaissancePere: new NgbDate(
          dateNaissPere.getFullYear(), dateNaissPere.getMonth()+1, dateNaissPere.getDate())});
      this.entityForm.patchValue({paysPere: entity.paysPere});
      //Mere
      this.entityForm.patchValue({nomMere: entity.nomMere});
      this.entityForm.patchValue({prenomsMere: entity.prenomsMere});
      let dateNaissMere = new Date(entity.dateNaissanceMere);
      this.entityForm.patchValue({dateNaissanceMere: new NgbDate(
          dateNaissMere.getFullYear(), dateNaissMere.getMonth()+1, dateNaissMere.getDate())});
      this.entityForm.patchValue({paysMere: entity.paysMere});
      //Conjoint
      this.entityForm.patchValue({nomConjoint: entity.nomConjoint});
      this.entityForm.patchValue({prenomConjoint: entity.prenomConjoint});
      let dateNaissConjoint = new Date(entity.dateNaissanceConjoint);
      this.entityForm.patchValue({dateNaissanceConjoint: new NgbDate(
          dateNaissConjoint.getFullYear(), dateNaissConjoint.getMonth()+1, dateNaissConjoint.getDate())});
      this.entityForm.patchValue({paysConjoint: entity.paysConjoint});
      //Employeur
      this.entityForm.patchValue({nomEmployeur: entity.nomEmployeur});
      this.entityForm.patchValue({adressePostaleEmp: entity.adressePostaleEmp});
      this.entityForm.patchValue({adresseGeoEmp: entity.adresseGeoEmp});
      this.entityForm.patchValue({telEmp: entity.telEmp});
      this.entityForm.patchValue({emailEmp: entity.emailEmp});
      this.entityForm.patchValue({secteurEmp: entity.secteurEmp});
      // let dateExpirationPiece = new Date(entity.dateExpirationPiece);
      // this.entityForm.patchValue({dateExpirationPiece: new NgbDate(
      //     dateExpirationPiece.getFullYear(), dateExpirationPiece.getMonth()+1, dateExpirationPiece.getDate())});
    }
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
    // this.entityForm.patchValue({numeroPiece: entity.numeroPiece});
    // this.entityForm.patchValue({typePiece: entity.typePiece});
    this.entityForm.patchValue({modeEtablissement: entity.modeEtablissement});
    this.entityForm.patchValue({secteur: entity.secteur});
    this.entityForm.patchValue({degre: entity.degre});
    this.entityForm.patchValue({distributeur: entity.distributeur});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({quartier: entity.quartier});

    //SGI
    this.entityForm.patchValue({estsgi: entity.estsgi});

    //PPE
    this.entityForm.patchValue({ppe1: entity.ppe1});
    this.entityForm.patchValue({ppe2: entity.ppe2});
    this.entityForm.patchValue({ppe3: entity.ppe3});
    this.entityForm.patchValue({ppe4: entity.ppe4});

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
    // this.degreService.get().pipe(
    //   tap((resp) => console.log("DATA === ", resp))
    // ).subscribe();
    // this.degreService.afficherTous().subscribe(
    //   (data)=>{
    //     console.log("DEGRE === ", data);
    //     this.degres$=data;
    //   }
    // )
  }

  getProfessionAll = () => {
    // const sb  = this.professionService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.professionService.fetch();
    // this.professions$ = this.professionService.items$;
    this.professionService.afficherListe().subscribe(
      (data)=>{
        this.professions$=data;
      }
    )
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

  callDistribeurForm() {
    const modalRef = this.modalService.open(PersonnePhysiqueAddEditComponent, {
      backdrop: "static",
      size: "xl"
    });
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
      this.entityForm.patchValue({modeEtablissementDto: this.modeEtablissement$.find((o:any) => o.idModeEtablissement == receivedEntry.idModeEtablissement)});
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
      this.entityForm.patchValue({profession: this.professions$.find((o:any) => o.idProf == receivedEntry.idProf)});
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
      this.entityForm.patchValue({secteur: this.secteurs$.find((o:any) => o.idSecteur == receivedEntry.idSecteur)});
      // this.secteurs$ = this.secteurs$.pipe(
      //   tap((data: any) => this.entityForm.patchValue({secteur: data.find((o:any) => o.idSecteur == receivedEntry.idSecteur)})),
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
        tap((resp) => this.entityForm.patchValue({degre: resp.data.find((o:any) => o.idDegre == receivedEntry.idDegre)})),
      );
    });
  }

  onSaveEntity = () => {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;

    const formdata = new FormData();
    this.files.forEach((file) => { formdata.append('files', file); });

    // formdata.forEach((value,key) => {
    //   console.log(key, value)
    // });
    //
    // Object.entries(formdata).forEach(([key, value]) => {
    //   console.log("Clé = ", key, " Valeur = ", value);
    // });

    // formData.append("files[]", this.selectedFiles);
    // this.formData.append("data", JSON.stringify(this.entityForm.value));
    // Display the key/value pairs
    // return;
    this.submitting = true;
    const sb = this.saveEntity(formdata)
      .pipe(
        filter(res => res != null && res.idPersonne > 0),
        switchMap(res => {
          //Enregistrement des statuts de personne
          return this.statutPersonneService.ajouterStatutSelonQualite({...this.statutPersonnes.controls[0].value, personne: {idPersonne: res.idPersonne}}, this.qualite);
        }),
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          //Redirigez vers la liste
          this.router.navigate([`/app/standard/parametre/personne/physique/${this.qualite}`]);
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
    if(this.entityForm.controls.dateNaissance.value)
    {
      dateNaiss = new Date(
        this.entityForm.controls.dateNaissance.value.year,
        this.entityForm.controls.dateNaissance.value.month-1,
        this.entityForm.controls.dateNaissance.value.day+1);
    }
    let personne = {
      ...this.entityForm.value,
      dateNaissance: dateNaiss
    }

    if(this.qualite !== "prospect") {
      let dateNaissPere: any;
      if (this.entityForm.controls.dateNaissancePere.value)
      {
        dateNaissPere = new Date(
          this.entityForm.controls.dateNaissancePere.value.year,
          this.entityForm.controls.dateNaissancePere.value.month-1,
          this.entityForm.controls.dateNaissancePere.value.day+1);
      }

      let dateNaissMere: any;
      if (this.entityForm.controls.dateNaissanceMere.value)
      {
        dateNaissMere = new Date(
          this.entityForm.controls.dateNaissanceMere.value.year,
          this.entityForm.controls.dateNaissanceMere.value.month-1,
          this.entityForm.controls.dateNaissanceMere.value.day+1);
      }

      let dateNaissConjoint: any;
      if (this.entityForm.controls.dateNaissanceConjoint.value) {
        dateNaissConjoint = new Date(
          this.entityForm.controls.dateNaissanceConjoint.value.year,
          this.entityForm.controls.dateNaissanceConjoint.value.month-1,
          this.entityForm.controls.dateNaissanceConjoint.value.day+1);
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
    // this.element.nativeElement.focus();
    // $(this.element.nativeElement).select2();
    // $(this.element.nativeElement).select2({
    //   theme: 'bootstrap4'
    // });
    $('.select2').select2();
  }
}
