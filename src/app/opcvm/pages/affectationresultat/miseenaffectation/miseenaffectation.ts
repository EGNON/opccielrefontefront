import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, catchError, of, finalize } from 'rxjs';
import { Natureoperation } from '../../../../core/models/natureoperation.model';
import { Opcvm } from '../../../../core/models/opcvm';
import { AuthService } from '../../../../core/modules/auth';
import { Monnaie } from '../../../../crm/models/monnaie.model';
import { PersonnePhysique } from '../../../../crm/models/personne/personne.physique.model';
import { PersonnePhysiqueService } from '../../../../crm/services/personne/personne.physique.service';
import { PersonneService } from '../../../../crm/services/personne/personne.service';
import { LoaderService } from '../../../../loader.service';
import { LocalService } from '../../../../services/local.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { Ordresignataire } from '../../../models/ordresignataire.model';
import { DetailprofilService } from '../../../services/detailprofil.service';
import { OrdreService } from '../../../services/ordre.service';
import { OrdresignataireService } from '../../../services/ordresignataire.service';
import { TypeordreService } from '../../../services/typeordre.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { Exercice } from '../../../models/exercice.model';
import { ExerciceService } from '../../../services/exercice.service';

@Component({
  selector: 'app-miseenaffectation',
  standalone: false,
  templateUrl: './miseenaffectation.html',
  styleUrl: './miseenaffectation.scss'
})
export class Miseenaffectation implements OnInit, OnDestroy{
  id?: number;
  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
  precalculBouton:boolean;
  saveBouton:boolean;
  printBouton:boolean;
  public exerciceSettings = {};
  public personnePhysiqueSettings = {};
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  exercice$: any;
  typeOrdre$: any;
  personne: any;
  ordreSignataire: Ordresignataire;
  ordreSignataire$: any;
  personnePhysique$: any;
  personnePhysique: any;
  exerciceSelectionne: Exercice[] = [];
  personnePhysiqueSelectionne: PersonnePhysique[] = [];
  exerciceSelonId: Exercice;
  isLoading = false;
  submitting = false;
  idPersonneTab:any[];
  paysSelect:any;
  ordreDto$:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  coursLimite:any;
  symbolexercice:any;
  quantiteLimite:any;
  exercice: any;
  exerciceModel: Exercice;
  idexercice:any;
  enabledBouton:boolean;

  codeExercice:any;
  @Input() nb: number;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: LibrairiesService,
    public ordreSignataireService: OrdresignataireService,
    public detailProfilService: DetailprofilService,
    public personneService: PersonneService,
    public personnePhysiqueService: PersonnePhysiqueService,
    public exerciceService: ExerciceService,
    public typeOrdreService: TypeordreService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    public loadingService: LoaderService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
      this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
     const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        dateMiseEnAffectation: [new NgbDate(dateSeance.getFullYear(),dateSeance.getMonth()+1,
        dateSeance.getDate()),Validators.required],
        exercice: [null,Validators.required],
        resultat: [0],
        regBeneInstAffectation: [0],
        beneInstAffectation: [0],
        nbrePartEnCirculation: [0],
        coupDivUnitaire: [0]
      }
    );
    this.exerciceSettings = {
      singleSelection: true,
      idField: 'codeExercice',
      textField: 'codeExercice',
      enableCheckAll: false,
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
    
    this.afficherexercice();
    
  }
  afficherMiseEnAffectation(){
    const param={
      opcvm:this.currentOpcvm,
      codeExercice:this.codeExercice
    }
    console.log(param)
      const sb = this.entityService.afficherMiseEnAffectation(param)
        .subscribe((entity)=>{
          // this.entity=entity.data;
          console.log(entity.data)
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
  }
  loadFormValues(entity: any)
  {
    if(entity.length!==0){
            this.entity = entity;
        let dateMiseEnAffectation = new Date(entity[0].dateMiseEnAffectation);
        this.entityForm.patchValue({dateOrdre: new NgbDate(
            dateMiseEnAffectation.getFullYear(), dateMiseEnAffectation.getMonth()+1, dateMiseEnAffectation.getDate())});

        // if(entity.codeExercice != null)
        // {
        //   this.exerciceModel=new Exercice();
        //   this.exerciceModel.codeExercice=entity.codeExercice;
        //   this.exerciceSelectionne=[];
        //   // for (let i = 0; i < entity.exercice.length; i++) {
        //     this.exerciceSelectionne.push(this.exerciceModel)
        //   // }
        //   console.log(this.exerciceSelectionne)
        //   this.exercices.patchValue(this.exerciceSelectionne);
        // }
        // else
        // {
        //   this.exerciceSelectionne=[];
        //   this.exercices.patchValue(this.exerciceSelectionne);
        // }
        let valeur:string=""
        valeur=entity[0].resultat
        console.log("valeur=",valeur)
        this.codeExercice=entity.codeExercice
        this.entityForm.patchValue({resultat: valeur.toString()});
        valeur=entity[0].regBeneInstAffectation
        this.entityForm.patchValue({regBeneInstAffectation: valeur.toString()});
        valeur=entity[0].beneInstAffectation
        this.entityForm.patchValue({beneInstAffectation: valeur.toString()});
        valeur=entity[0].nbrePartEnCirculation
        this.entityForm.patchValue({nbrePartEnCirculation: valeur.toString()});
        valeur=entity[0].coupDivUnitaire
        this.entityForm.patchValue({coupDivUnitaire: valeur.toString()});
        this.enabledBouton=true
    }
    else
    {
      this.entityForm.patchValue({resultat:"0"});
      this.entityForm.patchValue({regBeneInstAffectation: "0"});
      this.entityForm.patchValue({beneInstAffectation: "0"});
      this.entityForm.patchValue({nbrePartEnCirculation: "0"});
      this.entityForm.patchValue({coupDivUnitaire: "0"});
        this.enabledBouton=false
    }
    console.log(this.enabledBouton)
  }
  addField(): void {
    let i=0
    for(i===0;i<=100;i++)
    {
      // this.entityForm.addControl("idPersonne"+i, new FormControl('', Validators.required));
      this.entityForm.addControl("checkSignataire"+i, new FormControl(''));
    }

  }
  get exercices(): FormArray { return <FormArray>this.entityForm.get('exercice')}
  get signataires(): FormArray { return <FormArray>this.entityForm.get('signataire')}

 

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  
  calculer(){
    // this.loadingService.setLoading(true)
    this.precalculBouton=true;
    let dateMiseEnAffectation: any;
    if(this.entityForm.controls.dateMiseEnAffectation.value)
    {
      dateMiseEnAffectation = new Date(
        this.entityForm.controls.dateMiseEnAffectation.value.year,
        this.entityForm.controls.dateMiseEnAffectation.value.month-1,
        this.entityForm.controls.dateMiseEnAffectation.value.day+1);
    }
   
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    const entity={
      idOpcvm:this.opcvm.idOpcvm,
      dateEstimation:dateMiseEnAffectation
    }
    console.log("entity=",entity)
    this.entityService.precalculMiseEnAffectation(entity).subscribe(
      (data)=>{
        this.entity=data.data
        console.log(this.entity)
        this.entityForm.patchValue({resultat: this.entity.resultat});
        this.entityForm.patchValue({regBeneInstAffectation: this.entity.regBeneInstAffectation});
        this.entityForm.patchValue({beneInstAffectation: this.entity.beneInstAffectation.toString()});
        this.entityForm.patchValue({nbrePartEnCirculation: this.entity.nbrePartEnCirculation.toString()});
        this.entityForm.patchValue({coupDivUnitaire: this.entity.coupDivUnitaire.toString()});
        this.enabledBouton=false
        //this.loadingService.setLoading(false)
        this.precalculBouton=false;
      }
    )

  }

  afficherexercice(){
    this.exerciceService.afficherExerciceClos(this.currentOpcvm.idOpcvm).subscribe(
      (data)=>{
        this.exercice$=data
        this.exercice=data
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
    this.codeExercice=item.codeExercice
    console.log(this.codeExercice);
    this.afficherMiseEnAffectation();

  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
    this.codeExercice=""
    this.entityForm.patchValue({resultat:"0"});
    this.entityForm.patchValue({regBeneInstAffectation: "0"});
    this.entityForm.patchValue({beneInstAffectation: "0"});
    this.entityForm.patchValue({nbrePartEnCirculation: "0"});
    this.entityForm.patchValue({coupDivUnitaire: "0"});
    this.enabledBouton=true
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  
  changeexercice(){
    // this.entityForm.patchValue({designation:this.entityForm.value.exercice.designationexercice})
    // this.entityForm.patchValue({depositaire:this.entityForm.value.exercice.depositaire.denomination})
    // this.entityForm.patchValue({cotation:this.entityForm.value.exercice.cotation})
    // this.entityForm.patchValue({place:this.entityForm.value.place.libellePlace})
  }
  get f() { return this.entityForm.controls; }
  
  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_OrdreSignataire");
    var length = this.tableau.getElementsByTagName('tr').length
    if (length == 2) {
      var tr = this.tableau.getElementsByTagName('tr')[1];
      tr.remove();
    } else {
      var tr = this.tableau.getElementsByTagName('tr')[index];
      tr.remove();
    }
    //  console.log(tr);
    // console.log(index);

  }
  afficherIntervenant(){
    this.personneService.afficherPersonneSelonQualite("REGISTRAIRES").subscribe(
      (data)=>{
        this.personne$=data
      }
    )
  }
  onSaveEntity()
  {
  
   
    if (this.codeExercice ==="") {

      alert("Veuillez cocher un exercice")
      return;
    }
    this.isLoading = true;
    this.submitted = true;
    this.saveBouton=true;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.saveBouton=false;
          this.enabledBouton=true
          alert('Enregistrement effectué avecsuccès')
          //this.router.navigate(['/opcvm/ordre/liste']);
        })
      )
      .subscribe(
        (data)=>{
            console.log(data.data)
          
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    let dateMiseEnAffectation: any;
    if(this.entityForm.controls.dateMiseEnAffectation.value)
    {
      dateMiseEnAffectation = new Date(
        this.entityForm.controls.dateMiseEnAffectation.value.year,
        this.entityForm.controls.dateMiseEnAffectation.value.month-1,
        this.entityForm.controls.dateMiseEnAffectation.value.day+1);
    }
    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm,
      dateMiseEnAffectation:dateMiseEnAffectation,
      exercice:this.exerciceModel,
      codeExercice:this.codeExercice,
      resultat:Number(this.entityForm.value.resultat),
      regBeneInstAffectation:Number(this.entityForm.value.regBeneInstAffectation),
      beneInstAffectation:Number(this.entityForm.value.beneInstAffectation),
      nbrePartEnCirculation:Number(this.entityForm.value.nbrePartEnCirculation),
      coupDivUnitaire:Number(this.entityForm.value.coupDivUnitaire),
      idSeance:this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance,
      userLogin:this.authService.currentUserValue?.username
    };

    console.log("act1",entity)
    return this.id
      ? this.entityService.creerMiseEnAffectation(entity)
      : this.entityService.creerMiseEnAffectation(entity);
  }
}
