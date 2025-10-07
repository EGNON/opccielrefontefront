import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of, Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {CompterenduService} from "../../../services/compterendu.service";
import {RdvService} from "../../../services/rdv.service";
import {ProduitService} from "../../../services/produit.service";
import {NgbDate, NgbTimepickerConfig, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {Typedocument} from "../../../models/typedocument.model";
import {TypeDocumentService} from "../../../services/type-document.service";
import {AlerteService} from "../../../services/alerte.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OpcvmService} from "../../../../core/services/opcvm.service";

@Component({
    selector: 'app-compterendu-add-edit',
    templateUrl: './compterendu-add-edit.component.html',
    styleUrls: ['./compterendu-add-edit.component.scss'],
    standalone: false
})
export class CompterenduAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  produits$: any;
  opcvm$: any;
  rdvs$: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  entity: any;
  entityForm: FormGroup;
  private subscriptions: Subscription[] = [];
  heure:number;
  minute:number;
  seconde:number;
  heureDebut: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  heureFin: NgbTimeStruct = { hour: 23, minute: 59, second: 59 };

  heureFin$: BehaviorSubject<NgbTimeStruct> = new BehaviorSubject<NgbTimeStruct>({ hour: 23, minute: 59, second: 59 });
  time: { hour: number, minute: number,second:number};
  typeDocuments$: Observable<Typedocument[]>;
  selectedFiles: { [k: string]: any } = {};

  rappel: boolean = false;
  files: File[] = [];

  constructor(
    private alerteService: AlerteService,
    private authService: AuthService,
    private config: NgbTimepickerConfig,
    private typeDocService: TypeDocumentService,
    private entityService: CompterenduService,
    private rdvService: RdvService,
    private produitService: ProduitService,
    private opcvmService: OpcvmService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    config.seconds = true;
    config.spinners = false;
    config.size =  "small";
    config.meridian = false;
  }

  ngOnInit(): void {
    const date1 = new Date();
    this.heureDebut.hour = date1.getHours();
    this.heureDebut.minute = date1.getMinutes();
    this.heureDebut.second = date1.getSeconds();
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idCR: [this.id],
        dateCR: [null],
        heureDebCR: [this.heureDebut],
        heureFinCR: [this.heureFin],
        objetCR: [null, Validators.required],
        appreciation: [null, Validators.required],
        description: [null, Validators.required],
        dateProchainRDV: [null, Validators.required],
        montantPromesse: [0],
        montantRealisation: [0],
        promesse: [null],
        realisation: [null],
        dateEffectivePromesse: [null],
        opcvmASouscrire: [null],
        opcvmSouscrit: [null],
        rdv: [null, Validators.required],
        documents: this.fb.array([]),
        idCreateur: [this.authService.currentUserValue?.idPersonne],
        estRappel: [null],
        elementRappel: [null],
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
    this.getTypeDocumentsAll();
    this.getRdvAll();
    this.getProduitAll();
    this.subscriptions.push(sb);
    if(this.id)
      this.pageInfo.updateTitle("Modification de compte rendu")
    else
      this.pageInfo.updateTitle("Ajout de compte rendu")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }

  onCheckBoxClick($event: any)
  {
    if($event.target.checked)
    {
      this.rappel = true;
    }
    else
    {
      this.rappel = false;
    }
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({id: entity.idCR});
    this.entityForm.patchValue({idCR: entity.idCR});
    this.entityForm.patchValue({objetCR: entity.objetCR});

    this.heureDebut= entity.heureDebCR;
    //this.heureDebut.hour = entity.heureDebCR.getHours();
    //this.heureDebut.minute = entity.heureDebCR.getMinutes();
    //this.heureDebut.second = entity.heureDebCR.getSeconds();

    this.time = {
      hour: parseInt(entity.heureDebCR.split(':')[0],10),
      minute:parseInt(entity.heureDebCR.split(':')[1],10),
      second:parseInt(entity.heureDebCR.split(':')[2],10)
    };
    console.log(this.time)
    this.entityForm.patchValue({heureDebCR: this.time});
    const [hour, minute, second] = entity.heureFinCR.split(':');
    this.time = {
      hour: parseInt(entity.heureFinCR.split(':')[0],10),
      minute:parseInt(entity.heureFinCR.split(':')[1],10),
      second:parseInt(entity.heureFinCR.split(':')[2],10)
    };
    console.log(this.time)
    this.entityForm.patchValue({heureFinCR: this.time});
    this.entityForm.patchValue({appreciation: entity.appreciation});
    this.entityForm.patchValue({description: entity.description});
    this.entityForm.patchValue({montantPromesse: entity.montantPromesse});
    this.entityForm.patchValue({montantRealisation: entity.montantRealisation});
    this.entityForm.patchValue({promesse: entity.promesse});
    this.entityForm.patchValue({realisation: entity.realisation});
    this.entityForm.patchValue({opcvmASouscrire: entity.opcvmASouscrire});
    this.entityForm.patchValue({opcvmSouscrit: entity.opcvmSouscrit});
    this.entityForm.patchValue({rdv: entity.rdv});

    let dateProchainRDV = new Date(entity.dateProchainRDV);
    this.entityForm.patchValue({dateProchainRDV: new NgbDate(
        dateProchainRDV.getFullYear(),
        dateProchainRDV.getMonth()+1,
        dateProchainRDV.getDate())});

    let dateEffectivePromesse = new Date(entity.dateEffectivePromesse);
    this.entityForm.patchValue({dateEffectivePromesse: new NgbDate(
        dateEffectivePromesse.getFullYear(),
        dateEffectivePromesse.getMonth()+1,
        dateEffectivePromesse.getDate())});

    //Chargement des documents existants
    if(entity.documents != null && entity.documents.length > 0)
    {
      let documents = entity.documents.sort((a:any,b:any) => a.idDoc - b.idDoc);
      for (let i = 0; i < entity.documents.length; i++) {
        this.files[i] = new File([new Blob()], documents[i].nomDoc + "." + documents[i].extensionDoc);
        this.documents.push(this.createItem(entity.documents[i]));
        this.documents.controls[i].patchValue(entity.documents[i]);
      }
    }
  }

  getTypeDocumentsAll()
  {
    this.typeDocuments$ = this.typeDocService.afficherTous();
  }

  getRdvAll()
  {
    this.rdvService.afficherListe().subscribe(
      (data)=>{
        this.rdvs$=data;
      }
    )
    // const sb  = this.rdvService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.rdvService.fetch();
    // this.rdvs$ = this.rdvService.items$;
  }

  getProduitAll()
  {
    // const sb  = this.produitService.isLoading$.subscribe((res: boolean) => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.produitService.fetch();
    // this.produits$ = this.produitService.items$;
    this.opcvmService.afficherTous().subscribe(
      (data)=>{
        this.opcvm$=data;
        console.log(this.opcvm$)
      }
    )
  }

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  get documents(): FormArray { return <FormArray>this.entityForm.get('documents')}

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

  onSaveEntity()
  {
    this.isLoading = true;
    this.submitted = true;

    if(this.entityForm.invalid) return;

    const formdata = new FormData();
    this.files.forEach((file) => { formdata.append('files', file); });

    this.submitting = true;
    const sb = this.saveEntity(formdata)
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (resp) => {
          if(resp && resp.estRappel && resp.elementRappel) {
            this.alerteService.currentCRValue = resp;
            let dateFinRappel = resp.elementRappel == "DPR" ? resp.dateProchainRDV : (resp.elementRappel == "DEP" ? resp.dateEffectivePromesse : null);
            this.router.navigate(['/crm/notifications/alertes/rappel/cr', resp.idCR],
              { queryParams: { id: resp.idCR, date: dateFinRappel}});
          }
          else
            this.router.navigate(['/crm/rendezvous/compterendu']);
        }
      });
    this.subscriptions.push(sb);
  }

  saveEntity(formData: any) {
    let dateProchainRDV: any;
    if(this.entityForm.controls.dateProchainRDV.value)
    {
      dateProchainRDV = new Date(
        this.entityForm.controls.dateProchainRDV.value.year,
        this.entityForm.controls.dateProchainRDV.value.month-1,
        this.entityForm.controls.dateProchainRDV.value.day+1);
    }
    let dateEffectivePromesse: any;
    if(this.entityForm.controls.dateEffectivePromesse.value)
    {
      dateEffectivePromesse = new Date(
        this.entityForm.controls.dateEffectivePromesse.value.year,
        this.entityForm.controls.dateEffectivePromesse.value.month-1,
        this.entityForm.controls.dateEffectivePromesse.value.day+1);
    }
    const entity = {
      ...this.entityForm.value,
      dateProchainRDV: dateProchainRDV,
      dateEffectivePromesse: dateEffectivePromesse,
    }
    entity.dateCR = new Date();
    if(this.entityForm.controls.heureDebCR.value)
    {
      let hour = this.entityForm.controls.heureDebCR.value.hour;
      let minute = this.entityForm.controls.heureDebCR.value.minute;
      let second = this.entityForm.controls.heureDebCR.value.second;
      entity.heureDebCR = ('0' + hour).slice(-2) + ":"
        + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    }
    if(this.entityForm.controls.heureFinCR.value)
    {
      let hour = this.entityForm.controls.heureFinCR.value.hour;
      let minute = this.entityForm.controls.heureFinCR.value.minute;
      let second = this.entityForm.controls.heureFinCR.value.second;
      entity.heureFinCR = ('0' + hour).slice(-2) + ":"
        + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2);
    }

    formData.append("data", JSON.stringify(entity));
    //console.log(JSON.stringify(entity))
    return this.id
      ? this.entityService.updateFn(formData, entity.idCR)
      : this.entityService.createFn(formData);
  }

  onClick(id: string) {
    document.getElementById(id)?.click();
  }
}
