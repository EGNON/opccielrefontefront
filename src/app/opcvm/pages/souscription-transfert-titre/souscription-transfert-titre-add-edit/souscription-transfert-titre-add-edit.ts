import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, map, tap, filter, switchMap, Observable, catchError, of, finalize } from 'rxjs';
import { PersonneService } from '../../../../crm/services/personne/personne.service';
import { LoaderService } from '../../../../loader.service';
import { LocalService } from '../../../../services/local.service';
import { PageInfoService } from '../../../../template/_metronic/layout';
import { DepotsouscriptionService } from '../../../services/depotsouscription.service';
import { DepotrachatService } from '../../../services/depotrachat.service';
import { TitreService } from '../../../../titresciel/services/titre.service';
import { TitreModel } from '../../../../titresciel/models/titre.model';
import { Opcvm } from '../../../../core/models/opcvm';
import { AuthService } from '../../../../core/modules/auth';

@Component({
  selector: 'app-souscription-transfert-titre-add-edit',
  standalone: false,
  templateUrl: './souscription-transfert-titre-add-edit.html',
  styleUrl: './souscription-transfert-titre-add-edit.scss'
})
export class SouscriptionTransfertTitreAddEdit implements OnInit, AfterViewInit, OnDestroy{

  @Input() id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  
  coursLimite:any;
  symbolTitre:any;
  quantiteLimite:any;
  titre: any;

  entity: any;
  title: string;
  solde: number = 0;
  soldeEspece: number = 0;
  titreSelonId: TitreModel;
  currentOpcvm: any;
  personneActionnaire$: any;
  currentSeance: any;
  depotRachat$:any;
  idTitre:any;
  form: FormGroup;
  private subscriptions: Subscription[] = [];
  public titreSettings = {};
  [key: string]: any;

  constructor(
    private localStore: LocalService,
    private entityService: DepotrachatService,
    private personneService: PersonneService,
    public titreService: TitreService,
    public authService: AuthService,
    private fb: FormBuilder,
    private pageInfo: PageInfoService,
    private loadingService: LoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    console.log("Séance actuelle === ", this.currentSeance);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      id: [null],
      idOperation: [0],
      idTransaction: [1],
      idDepotRachat: [null],
      idSeance: [this.currentSeance?.idSeance],
      opcvm: [this.currentOpcvm],
      transaction: [null],
      natureOperation: [null],
      actionnaire: [null, Validators.required],
      personne: [null, Validators.required],
      libelleOperation: [null, Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      valeurFormule: [null],
      valeurCodeAnalytique: [null],
      dateSaisie: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      datePiece: [null],
      dateValeur: [null],
      estOD: [false],
      estGenere: [false],
      estVerifier: [false],
      estVerifie1: [false],
      estVerifie2: [false],
      userLoginVerificateur1: [""],
      dateVerification1: [null],
      userLoginVerificateur2: [""],
      dateVerification2: [null],
      dateVerification: [null],
      nomVerificateur: [""],
      referencePiece: [null],
      designation: [null],
      titre: [null],
      depositaire: [null],
      cotation: [null],
      commission: [0, Validators.required],
      interetCouru: [0, Validators.required],
      interetPrecompte: [0, Validators.required],
      cours: [0, Validators.required],
      modeVL: ["CONNU", Validators.required],
      quantite: [0],
      ecriture: ["A"],
      type: ["S"],
      soldeEspece: [0],
      montantBrut: [0],
      montantSouscrit: [0, Validators.required],
      montant: [0, Validators.required],
    });
    this.titreSettings = {
      singleSelection: true,
      idField: 'idTitre',
      textField: 'symbolTitre',
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
    this.afficherTitre();
    //Récupération de l'object correspondant à id
    // const paramSubscription = this.route.paramMap
    //   .pipe(
    //     map(paramMap => {
    //       let params: any = new Array(2);
    //       if(paramMap.has('id'))
    //       {
    //         params[0] = +paramMap.get('id')!;
    //         // this.title = "Modification de " + this.title;
    //       }

    //       return params;
    //     }),
    //     tap((params) => {
    //       this.id = params[0];
    //     }),
    //     filter(params => params[0]!),
    //     switchMap(params => this.entityService.getById(params[0]))
    //   ).subscribe(resp => this.loadFormValues(resp.data));
    // this.subscriptions.push(paramSubscription);

     this.getPersonnesAll('distributeurs');
    // //this.getPersonnesAll('actionnaires');
     this.afficherActionnaire();
     this.form.patchValue({montantBrut:"0"})
      this.form.patchValue({montant:"0"})
      //this.form.patchValue({cours:"0"})
      this.form.patchValue({commission:"0"})
      this.form.patchValue({interetCouru:"0"})
      this.form.patchValue({interetPrecompte:"0"})
      this.form.patchValue({libelleOperation:""})
    // const sb = this.form.get('actionnaire').valueChanges.pipe(
    //   tap(() => this.loadingService.setLoading(true)),
    //   switchMap(actionnaire => {
    //     return this.entityService.solde(actionnaire.idPersonne, this.currentOpcvm?.idOpcvm).pipe(
    //       map(result => {
    //         return {
    //           actionnaire: actionnaire,
    //           solde: result
    //         }
    //       })
    //     );
    //   })
    // ).subscribe(resp => {
    //   this.solde = resp.solde;
    //   this.form.patchValue({soldeEspece: this.solde});
    //   if(!this.id) {
    //     this.form.patchValue({montantSouscrit: 0});
    //     this.form.patchValue({montant: 0});
    //   }
    //   this.loadingService.setLoading(false);
    //   console.log("Solde === ", resp);
    // });
    // this.subscriptions.push(sb);
    // const sb1 = this.form.get('montant').valueChanges.subscribe(value => {
    //   const montant = value !== "" ? parseFloat(value) : 0;
    //   const monntantSouscrit = this.form.value.montantSouscrit !== "" ? parseFloat(this.form.value.montantSouscrit) : 0;
    //   /*if(this.id) {
    //     this.soldeEspece += this.entity?.montantSouscrit;
    //   }*/
    //   this.soldeEspece = this.solde + montant - monntantSouscrit;
    //   this.form.patchValue({soldeEspece: this.soldeEspece});
    //   if(montant > 0)
    //     this.form.patchValue({libelleOperation: `DEPOT DE ${montant} FCFA POUR SOUSCRIPTION`});
    //   else
    //     this.form.patchValue({libelleOperation: null});
    // });
    // this.subscriptions.push(sb1);
    // const sb2 = this.form.get('montantSouscrit').valueChanges.subscribe(value => {
    //   const montant = this.form.value.montant !== "" ? parseFloat(this.form.value.montant) : 0;
    //   const montantSouscrit = value !== "" ? parseFloat(value) : 0;
    //   if(this.soldeEspece < montantSouscrit) {
    //     this.form.patchValue({montantSouscrit: this.soldeEspece});
    //     this.form.patchValue({soldeEspece: 0});
    //   }
    //   else {
    //     this.form.patchValue({soldeEspece: this.solde + montant - montantSouscrit});
    //   }
    //   if(montant === 0 && montantSouscrit > 0)
    //     this.form.patchValue({libelleOperation: `REINVESTISSEMENT DE  ${montantSouscrit} FCFA POUR SOUSCRIPTION`});
    //   /*else
    //     this.form.patchValue({libelleOperation: `DEPOT DE ${montant} FCFA POUR SOUSCRIPTION`});*/
    // });
    // this.subscriptions.push(sb2);

    if(this.id)
    {
      this.title = "Modification de  souscription par transfert de titre";
      this.pageInfo.updateTitle(this.title);
      /*this.entityService.getById(this.id).subscribe((resp) => {
        const entity = resp.data;
        this.loadFormValues(entity);
      });*/
    }
    else
    {
      this.title = "Ajout de de  souscription par transfert de titre";
      this.pageInfo.updateTitle(this.title);
    }
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
    this.idTitre=item.idTitre
    this.symbolTitre=item.symbolTitre
    console.log(this.symbolTitre)
    this.titreService.getById(item.idTitre).subscribe(
      (data)=>{
        console.log(data.data)
        this.titreSelonId=data.data
        this.form.patchValue({designation:this.titreSelonId.designationTitre})
        this.form.patchValue({cotation:this.titreSelonId.libelleCotation})
        this.form.patchValue({depositaire:this.titreSelonId.depositaire.sigle})
        // this.calculer()
      }
    )

  }
  onCoursKeyPress($event) {
    this.coursLimite=$event.target.value
    this.calculer()
  }
  onQuantiteKeyPress($event) {
    this.quantiteLimite=$event.target.value
    this.calculer()
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
    this.idTitre=0
    this.form.patchValue({designation:''})
    this.form.patchValue({cotation:''})
    this.form.patchValue({depositaire:''})
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  afficherTitre(){
      this.titreService.afficherTous().subscribe(
        (data)=>{
          this.titre$=data.data
          this.titre=data.data
        }
      )
    }
  getPersonnesAll(qualite: any = null)
  {
    const name = qualite[qualite.length-1] === "s" ? `${qualite}$` : `${qualite}s$`;
    this[name] = this.personneService.afficherPersonneSelonQualite(qualite.toUpperCase().trim());
  }
  afficherActionnaire(){
    this.personneService.afficherPersonneInOpcvmEtStatutCompte(
      this.localStore.getData("currentOpcvm").idOpcvm
    ).subscribe(
      (data)=>{
        this.personneActionnaire$=data;
        //this.personneActionnaire=data;
       // console.log(data)
      }
    )
  }
  calculer(){
      this.loadingService.setLoading(true)
      // if(Number(this.coursLimite)===0 || Number(this.quantiteLimite===0)){
      //  this.form.patchValue({montantBrut:"0"})
      //     this.form.patchValue({montant:"0"})
      //     this.form.patchValue({interetCouru:"0"})
      //     this.form.patchValue({interetPrecompte:"0"})
      //     this.form.patchValue({libelleOperation:""})
      //   this.loadingService.setLoading(false)
      //   return
      // }
      let dateOperation: any;
      if(this.form.controls.dateOperation.value)
      {
        dateOperation = new Date(
          this.form.controls.dateOperation.value.year,
          this.form.controls.dateOperation.value.month-1,
          this.form.controls.dateOperation.value.day+1);
      }
      let dateSaisie: any;
      if(this.form.controls.dateSaisie.value)
      {
        dateSaisie = new Date(
          this.form.controls.dateSaisie.value.year,
          this.form.controls.dateSaisie.value.month-1,
          this.form.controls.dateSaisie.value.day+1);
      }
      this.titreModel=new TitreModel()
      this.titreModel.idTitre=this.idTitre
      this.opcvm=new Opcvm();
      this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
      const entity={
        ...this.form.value,
        cours:Number(this.coursLimite),
        quantiteLimite:Number(this.quantiteLimite),
        dateOperation:dateOperation,
        dateSaisie:dateSaisie,
        titre:this.titreModel,
        opcvm:this.opcvm
      }
      console.log("entity=",entity)
      this.entityService.calculer(entity).subscribe(
        (data)=>{
          this.depotRachat$=data.data
          console.log(this.depotRachat$)
          this.form.patchValue({montantBrut:this.depotRachat$.montantBrut.toString()})
          this.form.patchValue({montant:this.depotRachat$.montant.toString()})
          this.form.patchValue({interetCouru:this.depotRachat$.interetCouru.toString()})
          this.form.patchValue({interetPrecompte:this.depotRachat$.interetPrecompte.toString()})
          if (Number(this.depotRachat$.montant.toString()) > 0)
                {
                  this.form.patchValue({libelleOperation:
                    "SOUSCRIPTION DE " + this.depotRachat$.montant.toString() + " FCFA PAR TRANSFERT DE  " + this.quantiteLimite + 
                    " " + this.symbolTitre.trim()})
                  
                }
                else
                    this.form.patchValue({libelleOperation:""})
          this.loadingService.setLoading(false)
  
        }
      )
  
    }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    console.log("Entity === ", entity);
    this.form.patchValue(entity);
    this.form.patchValue({id: entity.idDepotRachat});
    let dateOperation = new Date(entity.dateOperation);
    this.form.patchValue({dateOperation: new NgbDate(
        dateOperation.getFullYear(), dateOperation.getMonth()+1, dateOperation.getDate())});
    this.form.patchValue({emitEvent: false});
  }

  save() {
    if(this.form.invalid) return;
    let result: Observable<any>;
    // const futureDate = new Date();
    // futureDate.setFullYear(futureDate.getFullYear() + 26);
    // futureDate.setMonth(11, 31);
    // this.form.patchValue({datePiece: this.form.get("dateOperation").value});
    // this.form.patchValue({dateValeur: this.form.get("dateOperation").value});
    let entity = this.form.value;
    for (const key in entity)
    {
      let value = entity[key];
      if(key.includes("date") && value != null) {
        const date = new Date(value.year, value.month-1, value.day+1);
        entity = {...entity, [key]: date};
      }
    }
    let titre=new TitreModel();
    titre.idTitre=this.idTitre
    entity = {
      ...entity,
      idSeance: this.currentSeance?.idSeanceOpcvm?.idSeance,
      opcvm: this.currentOpcvm,
      titre:titre,
      qte:this.quantiteLimite,
      referencePiece:this.form.value.referencePiece.toString(),
      userLogin:this.authService.currentUserValue?.username,
      // dateSaisie: new Date(),
      // dateVerification: futureDate,
      // dateVerification1: futureDate,
      // dateVerification2: futureDate,
      }
    console.log("Send form === ", entity);
    
    if(this.id) {
      result = this.entityService.modifier(entity, "D");
    }
    else {
      result = this.entityService.creerDepotRachatTransfert(entity);
    }
    result
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          this.isLoading = false;
          this.submitting = false;
          this.submitted = false;
        })
      )
      .subscribe(value => {
        console.log("Submit form === ", value);
        this.router.navigate(['/opcvm/souscriptiontransferttitre']);
      });
  }
}
