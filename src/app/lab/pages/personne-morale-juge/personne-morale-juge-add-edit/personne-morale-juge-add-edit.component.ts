import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Observable, of, Subscription, switchMap, tap} from "rxjs";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {catchError, filter, finalize, map} from "rxjs/operators";
import {Secteur} from "../../../../crm/models/secteur.model";
import {Profession} from "../../../../crm/models/profession.model";
import {ResponseModel} from "../../../../crm/models/table.model";
import {Degre} from "../../../../crm/models/degre.model";
import {Pays} from "../../../../crm/models/pays.model";
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
import {QualiteService} from "../../../../crm/services/qualite.service";
import {StatutPersonneService} from "../../../../crm/services/statut.personne.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";
import {Qualite} from "../../../../crm/models/qualite.model";
import {PieceJointe} from "../../../../crm/models/piece-jointe.model";
import {Quartier} from "../../../../crm/models/quartier.model";
import {PageInfoService} from "../../../../template/_metronic/layout";

@Component({
  selector: 'app-personne-morale-juge-add-edit',
  templateUrl: './personne-morale-juge-add-edit.component.html',
  styleUrl: './personne-morale-juge-add-edit.component.scss'
})
export class PersonneMoraleJugeAddEditComponent implements OnInit, OnDestroy, AfterViewInit{
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
        estJuge:[null]

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
      this.pageInfo.updateTitle("Ajout de personne jugée par des mesures de gel des avoirs");
    }
    else
      this.pageInfo.updateTitle("Modification de personne jugée par des mesures de gel des avoirs");

    this.getPaysAll()
    this.getPersonneMorale()
    this.personneSelect=document.getElementById("ComboPersonneMoraleExistanteJuge")


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  nouvellePersonneChange(){
    // @ts-ignore
    this.nouvellePersonne = document.getElementById("nouvellePersonneMoraleJuge").checked;
    if(this.nouvellePersonne)
    {
      this.personneExiste=false;
    }
  }
  personneExistante(){
    // console.log("ok")
    // @ts-ignore
    this.personneExiste = document.getElementById("personneMoraleJugeExistante").checked;
    console.log(this.personneExiste)
    if(this.personneExiste)
    {
      this.nouvellePersonne=false;

    }
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
    this.entityForm.patchValue({estJuge: true});
    this.entityForm.patchValue({id: entity.idPersonne});

    //Chargement des documents existants




  }


  getPersonneMorale(){
    this.personneMoraleService.afficherPersonneSelonQualite("actionnaire").subscribe(
      (data)=>{
        this.personneMorale$=data;
        console.log(this.personneMorale$)
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
    if(this.nouvellePersonne){
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
          switchMap(res => {
            // console.log("pass")
            // console.log("res=",res);
            this.statutPersonne=new class implements StatutPersonne {
              id: any;
              idStatutPersonne: any;
              personne: Personne;
              personnel: Personnel | null | undefined;
              qualite: Qualite | null | undefined;
            }
            this.statutPersonne.personne=res
            // console.log("passez")
            return this.statutPersonneService.ajouterStatutSelonQualite(this.statutPersonne,"juge");
          }),
          catchError((err) => {
            this.submitting = false;
            return of(err.message);
          }),
          finalize(() => {
            this.isLoading = false;
            this.submitted = false;
            //Redirigez vers la liste
            this.router.navigate([`/lab/standard/parametre/personne/morale/juge`]);
          })
        )
        .subscribe(res => {
          console.log("Response = ", res);

          // this.qualiteService.afficherSelonLibelle("juge").subscribe(
          //   (data)=>{
          //     this.qualiteModel=data;
          //     this.statutPersonne=new class implements StatutPersonne {
          //       id: any;
          //       personne: Personne;
          //       personnel: Personnel | null | undefined;
          //       qualite: Qualite | null | undefined;
          //     };
          //     console.log(res)
          //     this.statutPersonne.qualite=this.qualiteModel;
          //     this.statutPersonne.personne=res;
          //     console.log("statut=",this.statutPersonne)
          //     return this.id
          //       ? this.statutPersonneService.modifierStatutPersonne(this.statutPersonne,res.idPersonne,this.qualiteModel.idQualite)
          //       : this.statutPersonneService.create(this.statutPersonne).subscribe();
          //   }
          // )
          // this.statutPersonne.personne=res;
        });
      this.subscriptions.push(sb);
    }
    else
    {
      const formData = new FormData();
      this.personneMorale=new PersonneMorale();
      this.personneSelect=document.getElementById("ComboPersonneMoraleExistanteJuge")
      let idPersonne=this.personneSelect.options[this.personneSelect.selectedIndex].value;

      this.personneMoraleService.afficherPersonneMoraleSelonId(idPersonne).subscribe(
        (data)=>{
          this.personneMorale=data;

          // this.personneMorale.estJuge=this.entityForm.get('estJuge').checked;

          this.personneMorale.estJuge = true;

          this.qualiteService.afficherSelonLibelle("juge").subscribe(
            (data)=>{
              this.qualiteModel=data;
              this.statutPersonne=new class implements StatutPersonne {
                id: any;
                idStatutPersonne: any;
                personne: Personne;
                personnel: Personnel | null | undefined;
                qualite: Qualite | null | undefined;
              };
              // console.log(res)
              this.statutPersonne.qualite=this.qualiteModel;
              this.statutPersonne.personne=this.personneMorale;
              console.log("statut=",this.statutPersonne)
              return this.id
                ? this.statutPersonneService.modifierStatutPersonne(this.statutPersonne,this.personneMorale.idPersonne,this.qualiteModel.idQualite)
                : this.statutPersonneService.create(this.statutPersonne).subscribe();
            }
          )
          console.log("personne=", this.personneMorale)
          formData.append("data", JSON.stringify(this.personneMorale));

          // return this.id
          // @ts-ignore
          this.entityService.update(this.personneMorale).pipe(
            finalize(() => {
              this.isLoading = false;
              this.submitted = false;
              //Redirigez vers la liste
              this.router.navigate([`/lab/standard/parametre/personne/morale/juge`]);
            })
          ).subscribe();
        }
      )

    }
  }

  saveEntity(formdata: any) {
    //Formatage des dates sous le format souhaité

    if(this.id){
      this.estJuge=this.entityForm.get('estJuge')?.value;
    }
    else
      this.estJuge=true;

    let personne=null;
    // if(this.id)
    // {
    //   this.personneMoraleService.afficherPersonneMoraleSelonId(this.id).subscribe(
    //     (data)=>{
    //       this.personneMorale=data;
    //       console.log("personneMorale&&&&&=",this.personneMorale)
    //       console.log("ppays=",this.entityForm.value.personneMoralePaysDtos.length);
    //       if(this.entityForm.value.personneMoralePaysDtos.length!=0)
    //       {
    //         personne={...this.personneMorale,
    //           ...this.entityForm.value,
    //           dateNaissance: dateNaiss,
    //           estJuge:this.estJuge,
    //           personneMoralePaysDtos: this.entityForm.value.personneMoralePaysDtos.map((u: any) => {
    //             return {personneMoraleDto: null, paysDto: u};
    //           })}
    //         console.log("personne&&&&=",personne)
    //         formdata.append("data", JSON.stringify(personne));
    //
    //         console.log(this.id);
    //         console.log(formdata)
    //         return this.id
    //           ? this.entityService.updateFn(formdata,personne.idPersonne)
    //           : this.entityService.createFn(formdata);
    //       }
    //       else
    //       {
    //         personne={...this.personneMorale,
    //           ...this.entityForm.value,
    //           estJuge:this.estJuge,
    //           dateNaissance: dateNaiss
    //         }
    //         console.log("personne=",personne)
    //         formdata.append("data", JSON.stringify(personne));
    //
    //         console.log(this.id);
    //         return this.id
    //           ? this.entityService.updateFn(formdata,personne.idPersonne)
    //           : this.entityService.createFn(formdata);
    //       }});
    //
    // }
    // else
    // {
    //   if(this.entityForm.get('personneMoralePaysDtos')?.value!=null)
    //   {
    //     personne={ ...this.entityForm.value,
    //       dateNaissance: dateNaiss,
    //       estJuge:this.estJuge,
    //       personneMoralePaysDtos: this.entityForm.value.personneMoralePaysDtos.map((u: any) => {
    //         return {personneMoraleDto: null, paysDto: u};
    //       })}
    //     console.log("personne=",personne)
    //     formdata.append("data", JSON.stringify(personne));
    //
    //     console.log(this.id);
    //     return this.id
    //       ? this.entityService.updateFn(formdata,personne.idPersonne)
    //       : this.entityService.createFn(formdata);
    //   }
    //   else
    //   {
    //     personne={ ...this.entityForm.value,
    //       estJuge:this.estJuge,
    //       dateNaissance: dateNaiss
    //     }
    //     console.log("personne=",personne)
    //     formdata.append("data", JSON.stringify(personne));
    //
    //     console.log(this.id);
    //     return this.id
    //       ? this.entityService.updateFn(formdata,personne.idPersonne)
    //       :this.entityService.createFn(formdata);
    //   }
    // }
    //


    personne={
      ...this.entityForm.value,
      estJuge:this.estJuge
    }
    // }
    // else
    // {
    //   personne={
    //     ...this.entityForm.value,
    //     estJuge:this.estJuge
    //   }

    // }


    // personne={...this.personneMorale,
    //   ...this.entityForm.value,
    //   dateNaissance: dateNaiss,
    //   estJuge:this.estJuge,
    //   personneMoralePaysDtos: this.entityForm.value.personneMoralePaysDtos.map((u: any) => {
    //     return {personneMoraleDto: null, paysDto: u};
    //   })}
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
    console.log(this.element.nativeElement);
  }
}



