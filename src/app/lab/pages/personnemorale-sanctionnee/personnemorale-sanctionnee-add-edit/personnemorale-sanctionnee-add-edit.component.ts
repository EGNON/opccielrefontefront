import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {Secteur} from "../../../../crm/models/secteur.model";
import {Profession} from "../../../../crm/models/profession.model";
import {ResponseModel} from "../../../../crm/models/table.model";
import {Degre} from "../../../../crm/models/degre.model";
import {Typedocument} from "../../../../crm/models/typedocument.model";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {PersonneMorale} from "../../../../crm/models/personne/personne.morale.model";
import {Personnel} from "../../../../crm/models/personne/personnel.model";
import {StatutPersonne} from "../../../../crm/models/statut.personne.model";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
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
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {Qualite} from "../../../../crm/models/qualite.model";

@Component({
    selector: 'app-personnemorale-sanctionnee-add-edit',
    templateUrl: './personnemorale-sanctionnee-add-edit.component.html',
    styleUrl: './personnemorale-sanctionnee-add-edit.component.scss',
    standalone: false
})
export class PersonnemoraleSanctionneeAddEditComponent implements OnInit, OnDestroy, AfterViewInit{
  public paysSettings = {};
  public personneMoraleSettings = {};
  idPersonne:any;
  pays: any;
  personneMorale2: any;
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
  personneMorale$: any;
  personneSelect:any;
  personneMorale: PersonneMorale;
  personneMoraleUpdate: PersonneMorale;
  personnels$: Observable<Personnel[]>;
  private subscriptions: Subscription[] = [];
  statutPersonne:StatutPersonne;
  selectedFiles: { [k: string]: any } = {};
  progressInfos: any[] = [];
  message: string[] = [];
  previews = new Array<string>();
  personneExiste:boolean;
  nouvellePersonne:boolean;
  fileInfos?: Observable<any>;
  estJuge:any;
  etatConversion: boolean = false;
  formData: FormData = new FormData();
  files: File[] = [];

  constructor(
    private element: ElementRef,
    private entityService: PersonneMoraleService,
    private personneMoraleService: PersonneMoraleService,
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
        //Champs Personne Morale
        raisonSociale: [null, Validators.required],
        sigle: [null, Validators.required],
        paysResidence: [null],
        personneMorale2: [null],
        estJuge:[false],
        estExpose:[true],
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
    if(this.id==null)
    {
      this.pageInfo.updateTitle("Ajout de personne morale politiquement exposée");
    }
    else
      this.pageInfo.updateTitle("Modification de personne morale politiquement exposée");
  this.personneMoraleSettings = {
      singleSelection: true,
      idField: 'idPersonne',
      textField: 'denomination',
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
    this.getPaysAll()
    this.getPersonneMorale()
    this.personneSelect=document.getElementById("ComboPersonneMoraleExistanteJuge")


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  nouvellePersonneChange(){
    // @ts-ignore
    this.nouvellePersonne = document.getElementById("nouvellePersonneMoraleExpose").checked;
    if(this.nouvellePersonne)
    {
      this.personneExiste=false;
    }
  }
  personneExistante(){
    // console.log("ok")
    // @ts-ignore
    this.personneExiste = document.getElementById("personneMoraleExposeExistante").checked;
    console.log(this.personneExiste)
    if(this.personneExiste)
    {
      this.nouvellePersonne=false;

    }
  }
  public onItemSelect2(item: any) {
    // console.log('onItemSelect', item);
    let idPersonne=item.idPersonne;
    this.idPersonne=item.idPersonne
    this.personneMoraleService.afficherPersonneMoraleSelonId(idPersonne).subscribe(
      (data)=>{
        this.personneMorale=data;
        this.loadFormValues(data)});
  }
  public onDeSelect2(item: any) {
    // console.log('onDeSelect', item);
    let idPersonne=0;
    /* this.personneMoraleService.afficherPersonneMoraleSelonId(idPersonne).subscribe(
      (data)=>{
        this.personneMorale=data;
        this.loadFormValuesNew(data)}); */
    
  }

  public onSelectAll2(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll2(items: any) {
    // console.log('onDeSelectAll', items);
  }

  public onFilterChange2(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose2(item: any) {
    // console.log('onDropDownClose', item);
  }

  retournerPersonne(){
    this.personneSelect=document.getElementById("ComboPersonneMoraleExistanteJuge")
    let idPersonne=this.personneSelect.options[this.personneSelect.selectedIndex].value;
    this.personneMoraleService.afficherPersonneMoraleSelonId(idPersonne).subscribe(
      (data)=>{
        this.personneMorale=data;
        this.loadFormValues(data)});
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

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({raisonSociale: entity.raisonSociale});
    this.entityForm.patchValue({sigle: entity.sigle});
    this.entityForm.patchValue({paysResidence: entity.paysResidence});
    this.entityForm.patchValue({estJuge: entity.estJuge});
    this.entityForm.patchValue({estExpose: true});
    this.entityForm.patchValue({id: entity.idPersonne});

    //Chargement des documents existants
  }


  getPersonneMorale(){
    this.personneMoraleService.afficherPersonneSelonQualiteLab("actionnaires").subscribe(
      (data)=>{
        this.personneMorale$=data;
        this.personneMorale2=data
        //console.log(this.personneMorale$)
      }
    )
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

      this.isLoading = true;
      this.submitted = true;
//      this.submitting=true
      if(this.entityForm.invalid) return;

      if(this.entityForm.value.estJuge===false && this.entityForm.value.estExpose===false)
      {
        alert("Veuillez cocher au moins une sanction.")
        return;
      }
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
            this.submitting=false
            //Redirigez vers la liste
            this.router.navigate([`/lab/standard/parametre/personne/morale/expose`]);
          })
        )
        .subscribe(res => {
          console.log("Response = ", res);


        });
      this.subscriptions.push(sb);
  }

  saveEntity(formdata: any) {
    //Formatage des dates sous le format souhaité

    let personne=null;
  if(this.nouvellePersonne)
    if(!this.id)
      this.idPersonne=null;
    else
      this.idPersonne=this.id

    personne={
      ...this.entityForm.value,
      idPersonne:this.idPersonne
    }

    console.log("personne&&&&=",personne)
    formdata.append("data", JSON.stringify(personne));

    console.log(this.id);
    console.log(formdata)
    return this.id
      ? this.entityService.update(personne)
      : this.entityService.create(personne);
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

