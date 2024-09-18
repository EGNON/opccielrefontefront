import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {Secteur} from "../../../../crm/models/secteur.model";
import {Profession} from "../../../../crm/models/profession.model";
import {ResponseModel} from "../../../../crm/models/table.model";
import {Degre} from "../../../../crm/models/degre.model";
import {Typedocument} from "../../../../crm/models/typedocument.model";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {PersonnePhysique} from "../../../../crm/models/personne/personne.physique.model";
import {Personnel} from "../../../../crm/models/personne/personnel.model";
import {StatutPersonne} from "../../../../crm/models/statut.personne.model";
import {Pays} from "../../../../crm/models/pays.model";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {PersonnephysiquepaysService} from "../../../../crm/services/personnephysiquepays.service";
import {DegreService} from "../../../../crm/services/degre.service";
import {ProfessionService} from "../../../../crm/services/profession.service";
import {SecteurService} from "../../../../crm/services/secteur.service";
import {PaysService} from "../../../../crm/services/pays.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {Qualite} from "../../../../crm/models/qualite.model";

@Component({
  selector: 'app-personnephysique-sanctionnee-add-edit',
  templateUrl: './personnephysique-sanctionnee-add-edit.component.html',
  styleUrl: './personnephysique-sanctionnee-add-edit.component.scss'
})
export class PersonnephysiqueSanctionneeAddEditComponent implements OnInit, OnDestroy, AfterViewInit{
  public paysSettings = {};
  pays: any;
  qualite: string;
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  qualiteModel: any;
  entities: any[] = [];
  entityForm!: FormGroup;
  docs: Document[] = [];
  secteurs$: Observable<Secteur[]>;
  professions$: Observable<Profession[]>;
  degres$: Observable<ResponseModel<Degre>>;
  payss$: any;
  typeDocuments$: Observable<Typedocument[]>;
  distributeurs$: Observable<Personne[]>;
  personnePhysique$: any;
  personneSelect:any;
  personnePhysique: PersonnePhysique;
  personnePhysiqueUpdate: PersonnePhysique;
  personnels$: Observable<Personnel[]>;
  private subscriptions: Subscription[] = [];
  statutPersonne:StatutPersonne;
  selectedFiles: { [k: string]: any } = {};
  progressInfos: any[] = [];
  message: string[] = [];
  previews = new Array<string>();
  personneExiste:boolean;
  nouvellePersonne:boolean;
  paysSelectionne: Pays[] = [];
  fileInfos?: Observable<any>;
  estJuge:any;
  etatConversion: boolean = false;
  formData: FormData = new FormData();
  files: File[] = [];

  constructor(
    private element: ElementRef,
    private entityService: PersonnePhysiqueService,
    private personnephysiqueService: PersonnePhysiqueService,
    private personnePhysiquePaysService: PersonnephysiquepaysService,
    // private personneService: PersonneService,
    private degreService: DegreService,
    private professionService: ProfessionService,
    private secteurService: SecteurService,
    private paysService: PaysService,
    private pageInfo: PageInfoService,
    private qualiteService: QualiteService,
    private statutPersonneService: StatutPersonneService,
    private uploadService: FileUploadService,
    private typeDocService: TypeDocumentService,
    private personnelService: PersonnelService,
    private parserFormatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
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
        lieuNaissance: [null, Validators.required],
        paysResidence: [null],
        paysNationalite: [null, Validators.required],
        typePiece: [null],
        dateExpirationPiece: [null],
        documents: this.fb.array([]),
        personnePhysiquePaysDtos:[null],
        personnePhysiquePaysDtos2:[null],
        estJuge:[false],
        estExpose:[false]
      }
    );

    this.nouvellePersonne=true;
    //Récupération de l'object correspondant à id
    const paramSubscription = this.route.paramMap
      .pipe(
        // filter(paramMap => paramMap.has('id')),
        map(paramMap => {
          let params: any = new Array(2);
          if(paramMap.has('id'))
            params[0] = +paramMap.get('id')!;
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

    //Afficher ou cacher certains champs en fonction de la qualité
    // this.getPersonnesAll('distributeur');
    this.getPaysAll();
    if(this.id==null)
    {
      this.pageInfo.updateTitle("Ajout de personne sanctionnée")
    }
    else
      this.pageInfo.updateTitle("Modification de personne sanctionnée")

    this.getTypeDocumentsAll();
    // this.getPersonnelsAll();
    //this.getPersonnePhysique()
    this.personneSelect=document.getElementById("ComboPersonneExistanteJuge")
    this.paysSettings = {
      singleSelection: false,
      idField: 'idPays',
      textField: 'libelleFr',
      enableCheckAll: true,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  nouvellePersonneChange(){
    // @ts-ignore
    this.nouvellePersonne = document.getElementById("nouvellePersonnePhysiqueJuge").checked;
    if(this.nouvellePersonne)
    {
      this.personneExiste=false;
      this.retournerPersonne()
    }
  }
  personneExistante(){
    // console.log("ok")
    // @ts-ignore
    this.personneExiste = document.getElementById("personnePhysiqueExistanteJuge").checked;
    console.log(this.personneExiste)
    if(this.personneExiste)
    {
      this.nouvellePersonne=false;

    }
  }
  retournerPersonne(){
    this.personneSelect=document.getElementById("ComboPersonneExistanteJuge")
    let idPersonne=this.personneSelect.options[this.personneSelect.selectedIndex].value;
    this.personnephysiqueService.afficherPersonnePhysiqueSelonId(idPersonne).subscribe(
      (data)=>{
        this.personnePhysique=data;
        if(!this.nouvellePersonne)
          this.loadFormValues(data)
        else
          this.loadFormValuesNew(data);});
  }
  onAddFile() {
    this.documents.push(this.createItem({
      idDoc: null,
      dateValidite: null,
      dateRattachement: null,
      numeroPiece:null,
      chemin: null,
      nomDoc: null,
      extensionDoc: null,
      typeDocument: null,
      compteRendu: null,
      personne: null
    }));
  }

  get f() { return this.entityForm.controls; }

  // We will create multiple form controls inside defined form controls photos.
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get documents(): FormArray { return <FormArray>this.entityForm.get('documents')}


  onClick(id: string) {
    document.getElementById(id)?.click();
  }

  onDeleteFile(index: number) {
    this.documents.removeAt(index);
  }

  // selectFiles(index: number, event: any): void {
  //   this.message = [];
  //   this.progressInfos = [];
  //   this.selectedFiles = event.target.files;
  //
  //   this.previews = [];
  //   if (this.selectedFiles && this.selectedFiles[0]) {
  //     let file = this.selectedFiles[0];
  //     let fileToByte = this.fileToByte(file);
  //     const filename = file.name
  //
  //     let last_dot = filename.lastIndexOf('.');
  //     let ext = filename.slice(last_dot + 1);
  //     let name = filename.slice(0, last_dot);
  //
  //     let doc: any = {
  //       ...this.documents.controls[index].value,
  //       nomDoc: name,
  //       fToByte: fileToByte,
  //       extensionDoc: ext
  //     };
  //     this.documents.controls[index].patchValue(doc);
  //   }
  // }
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

  getFileName(file: any) {
    let filename: string = '';
    if (file) {
      const reader = new FileReader();
      filename = file.name

      let last_dot = filename.lastIndexOf('.');
      // let ext = filename.slice(last_dot + 1);
      filename = filename.slice(0, last_dot);
    }

    return filename;
  }

  getFileExtension(file: any) {
    let result: string = '';
    if (file) {
      const reader = new FileReader();
      const filename = file.name

      let last_dot = filename.lastIndexOf('.');
      result = filename.slice(last_dot + 1);
    }

    return result;
  }



  // get documents(): FormArray {
  //   return <FormArray>this.formData.get('documents')
  // }

  fileToByte(myFile: any) {
    var reader = new FileReader();
    var fileByteArray: any[] = [];
    reader.readAsArrayBuffer(myFile);
    reader.onloadend = function (evt: any) {
      if (evt.target.readyState == FileReader.DONE) {
        // var arrayBuffer = evt.target.result,
        //   array = new Uint8Array(arrayBuffer);
        // for (var i = 0; i < array.length; i++) {
        //   fileByteArray.push(array[i]);
        // }
        let arrayBuffer = evt.target.result,
          array = new Uint8Array(arrayBuffer);
        for (var byte of array) {
          fileByteArray.push(byte);
        }
      }
    }
    return fileByteArray;
  }
  loadFormValuesNew(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({estConvertie: false});
    this.entityForm.patchValue({civilite: null});
    this.entityForm.patchValue({statutMatrimonial: null});
    this.entityForm.patchValue({nom: ""});
    this.entityForm.patchValue({prenom: ""});
    this.entityForm.patchValue({sexe: null});
    let dateNaissance = new Date();
    this.entityForm.patchValue({dateNaissance: new NgbDate(
        dateNaissance.getFullYear(), dateNaissance.getMonth()+1, dateNaissance.getDate())});
    this.entityForm.patchValue({paysNationalite: null});
    this.entityForm.patchValue({paysResidence: null});
    this.entityForm.patchValue({numeroPiece: ""});
    this.entityForm.patchValue({lieuNaissance: ""});
    this.entityForm.patchValue({estExpose: true});

    //Chargement des documents existants
    // entity.documents.removeAll();
    if(entity.documents != null && entity.documents.length > 0)
    {
      let documents = entity.documents.sort((a:any,b:any) => a.idDoc - b.idDoc);
      for (let i = 0; i < documents.length; i++) {
        this.documents.removeAt(0);
        // this.documents.controls[i].enable({onlySelf:true,emitEvent:false});
      }
    }

    console.log("aaa=",entity.personnePhysiquePaysDtos)
    this.getPaysAll();
    if(entity.personnePhysiquePaysDtos != null && entity.personnePhysiquePaysDtos.length > 0) {
      for (let i = 0; i < entity.personnePhysiquePaysDtos.length; i++) {
        this.paysSelectionne.push(entity.personnePhysiquePaysDtos[i].paysDto)
      }
    }
    //   console.log(this.paysSelectionne)
    this.paysSelectionne=[];
    // console.log(this.payss.length);
    // this.onDeSelectAll(this.paysSelectionne)
    this.payss.patchValue(this.paysSelectionne);
    // }
  }
  loadFormValues(entity: any) {
    this.entity = entity;
    this.entityForm.patchValue({estConvertie: entity.estConvertie});
    this.entityForm.patchValue({civilite: entity.civilite});
    this.entityForm.patchValue({statutMatrimonial: entity.statutMatrimonial});
    this.entityForm.patchValue({nom: entity.nom});
    this.entityForm.patchValue({prenom: entity.prenom});
    this.entityForm.patchValue({sexe: entity.sexe});
    let dateNaissance = new Date(entity.dateNaissance);
    this.entityForm.patchValue({
      dateNaissance: new NgbDate(
        dateNaissance.getFullYear(), dateNaissance.getMonth() + 1, dateNaissance.getDate())
    });
    this.entityForm.patchValue({paysNationalite: entity.paysNationalite});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({numeroPiece: entity.numeroPiece});
    this.entityForm.patchValue({lieuNaissance: entity.lieuNaissance});
    this.entityForm.patchValue({estJuge: entity.estJuge});
    this.entityForm.patchValue({estExpose: entity.estExpose});

    //Chargement des documents existants
    if(entity.documents.length==0)
    {// if (entity.documents != null && entity.documents.length > 0) {
      if(this.documents.length> 0)
      {
        let documentLength=this.documents.length;
        for (let i = 0; i < documentLength; i++) {
          this.documents.removeAt(0);
          // this.documents.controls[i].enable({onlySelf:true,emitEvent:false});
        }
      }
      // else
      //     this.onAddFile();
    }
    else {
      if (this.documents.length > 0) {
        let documentLength = this.documents.length;
        for (let i = 0; i < documentLength; i++) {
          this.documents.removeAt(0);
          console.log("pass=", i)
          // this.documents.controls[i].enable({onlySelf:true,emitEvent:false});
        }
      }
      if (entity.documents != null && entity.documents.length > 0) {
        let documents = entity.documents.sort((a: any, b: any) => a.idDoc - b.idDoc);
        for (let i = 0; i < documents.length; i++) {
          this.files[i] = new File([new Blob()], documents[i].nomDoc + "." + documents[i].extensionDoc);
          this.documents.push(this.createItem({...documents[i], file: null}));
          this.documents.controls[i].patchValue({...documents[i], file: null});
          // this.documents.controls[i].enable({onlySelf:true,emitEvent:false});
        }
      }
    }
    console.log("aaa=",entity.personnePhysiquePaysDtos)
    if(entity.personnePhysiquePaysDtos != null && entity.personnePhysiquePaysDtos.length > 0)
    {
      this.paysSelectionne=[];
      for (let i = 0; i < entity.personnePhysiquePaysDtos.length; i++) {
        this.paysSelectionne.push(entity.personnePhysiquePaysDtos[i].paysDto)
      }
      console.log(this.paysSelectionne)
      this.payss.patchValue(this.paysSelectionne);
    }
    else
    {
      this.paysSelectionne=[];
      this.payss.patchValue(this.paysSelectionne);
    }
  }

  get payss(): FormArray { return <FormArray>this.entityForm.get('personnePhysiquePaysDtos')}

  // getPersonnelsAll()
  // {
  //   const sb = this.personnelService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
  //   this.subscriptions.push(sb);
  //   this.personnelService.fetch();
  //   this.personnels$ = this.personnelService.items$;
  // }
  getPersonnePhysique(){
    this.personnephysiqueService.afficherPersonneSelonQualite("actionnaire").subscribe(
      (data)=>{
        this.personnePhysique$=data;
        console.log(this.personnePhysique$)
      }
    )
  }
  getTypeDocumentsAll()
  {
    this.typeDocuments$ = this.typeDocService.afficherTous();
  }


  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  getPaysAll = () => {
    this.paysService.afficherPaysListe().subscribe(
      (data)=>{
        this.payss$=data;
        this.pays=data;
      }
    );
  }

  onSaveEntity = () => {
//    if(this.nouvellePersonne){
      this.isLoading = true;
      this.submitted = true;

      if(this.entityForm.invalid) return;

      const formdata = new FormData();
      this.files.forEach((file) => { formdata.append('files', file); });


      this.submitting = true;
      // @ts-ignore
      const sb = this.saveEntity(formdata)
        .pipe(
          filter(res => res != null && res.idPersonne > 0),
          catchError((err) => {
            this.submitting = false;
            return of(err.message);
          }),
          finalize(() => {
            this.isLoading = false;
            this.submitted = false;
            //Redirigez vers la liste
            this.router.navigate([`/lab/standard/parametre/personne/physique/sanctionnee`]);
          })
        )
        .subscribe(res => {
        });
      this.subscriptions.push(sb);

  }

  saveEntity(formdata: any) {
    //Formatage des dates sous le format souhaité
    let dateNaiss: any;
    if(this.entityForm.controls.dateNaissance.value)
    {
      dateNaiss = new Date(
        this.entityForm.controls.dateNaissance.value.year,
        this.entityForm.controls.dateNaissance.value.month-1,
        this.entityForm.controls.dateNaissance.value.day+1);
    }

    /*if(this.id){
      this.estJuge=this.entityForm.get('estJuge')?.value;
    }
    else
      this.estJuge=true;
    */
    let personne=null;

    if(this.entityForm.value.personnePhysiquePaysDtos!=null)
    {
      personne={
        ...this.entityForm.value,
        dateNaissance: dateNaiss,
    //    estJuge:this.estJuge,
        personnePhysiquePaysDtos: this.entityForm.value.personnePhysiquePaysDtos.map((u: any) => {
          return {personnePhysiqueDto: null, paysDto: u};
        })}
    }
    else
    {
      personne={
        ...this.entityForm.value,
      //  estJuge:this.estJuge,
        dateNaissance: dateNaiss
      }

    }

   // console.log("personne&&&&=",personne)
    formdata.append("data", JSON.stringify(personne));

    //console.log(this.id);
    //console.log(formdata)
    return this.id
      ? this.entityService.updateFn(formdata,personne.idPersonne)
      : this.entityService.createFn(formdata);
  }

  ngAfterViewInit(): void {
    // this.element.nativeElement.focus();
    // $(this.element.nativeElement).select2();
    // $(this.element.nativeElement).select2({
    //   theme: 'bootstrap4'
    // });
    //console.log(this.element.nativeElement);
  }
}
