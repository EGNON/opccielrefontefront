import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Detailprofil} from "../../../models/detailprofil.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {OperationdetachementService} from "../../../services/operationdetachement.service";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {FormuleService} from "../../../../core/services/formule.service";
import {TitreService} from "../../../../titresciel/services/titre.service";
import {TcnService} from "../../../../titresciel/services/tcn.service";
import {ObligationService} from "../../../../titresciel/services/obligation.service";
import {LoaderService} from "../../../../loader.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {TitreModel} from "../../../../titresciel/models/titre.model";
import {catchError, finalize} from "rxjs/operators";
import {OperationevenementsurvaleurService} from "../../../services/operationevenementsurvaleur.service";
import {checkCommonJSModules} from "@angular-devkit/build-angular/src/tools/esbuild/commonjs-checker";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {Operationevenementsurvaleur} from "../../../models/operationevenementsurvaleur.model";

@Component({
  selector: 'app-operationevenementsurvaleur-add-edit',
  templateUrl: './operationevenementsurvaleur-add-edit.component.html',
  styleUrl: './operationevenementsurvaleur-add-edit.component.scss'
})
export class OperationevenementsurvaleurAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  detailProfil: Detailprofil;
  formule$: any;
  typePayementVisible: boolean;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  titre$:any;
  operationDetachement$:any;
  tcn$:any;
  idTitre:any;
  titre:any;
  idOpcvm:any;
  dateFermeture:any;
  titreSelonId:any;
  bNominalRemb=false;
  bCoupDivUnit= false;
  bQtiteAMORT = false;
  codeTypeTitre:string;
  quantiteAmortie:number;
  NominalRemb:number;
  qteDetenue:number;
  montantRemb:number;
  couponDivUnitaire:number;
  couponDividendeTotal:number;
  commission:number;
  irvm:number;
  interetMoratoireCapital:number;
  interetMoratoireInteret:number;
  libelleModeAmortissement:any;
  public titreSettings = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: OperationevenementsurvaleurService,
    public detachementService: OperationdetachementService,
    public personneService: PersonneService,
    public formuleService: FormuleService,
    public titreService: TitreService,
    public tcnService: TcnService,
    public obligationService: ObligationService,
    public loadingService: LoaderService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        idOperation: [this.id],
        dateOperation: [null,Validators.required],
        dateValeur: [null,Validators.required],
        typeEvenement: [null,Validators.required],
        typePayement: [null],
        codeTypeTitre: [null],
        estPaye: [false],
        intervenant: [null,Validators.required],
        symboleTitre: [null],
        designation: [null],
        idIntervenant: [null],
        idTitre: [null],
        quantiteAmortie: [null,Validators.required],
        nominalRemb: [null,Validators.required],
        capitalRembourse: [null,Validators.required],
        qteDetenue: [null,Validators.required],
        couponDividendeUnitaire: [null,Validators.required],
        couponDividendeTotal: [null,Validators.required],
        montantTotalARecevoir: [null,Validators.required],
        operationDetachement: [null,Validators.required],
        commission:[null,Validators.required],
        irvm:[null,Validators.required],
        interetMoratoireSurCapital:[null,Validators.required],
        interetMoratoireSurInteret:[null,Validators.required],
        commissionSurInteretMoratoire:[null,Validators.required],
        referenceAvis:[null,Validators.required],
      }
    );
    this.titreSettings = {
      singleSelection: true,
      idField: 'idTitre',
      textField: 'symboleTitre',
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
    // this.paysSelect = document.getElementById("ComboPaysLab");
    this.entityForm.patchValue({quantiteAmortie:"0"})
    this.entityForm.patchValue({nominalRemb:"0"})
    this.entityForm.patchValue({capitalRembourse:"0"})
    this.entityForm.patchValue({qteDetenue:"0"})
    this.entityForm.patchValue({couponDividendeUnitaire:"0"})
    this.entityForm.patchValue({couponDividendeTotal:"0"})
    this.entityForm.patchValue({montantTotalARecevoir:"0"})

    this.entityForm.patchValue({commission:"0"})
    this.entityForm.patchValue({irvm:"0"})
    this.entityForm.patchValue({interetMoratoireSurCapital:"0"})
    this.entityForm.patchValue({interetMoratoireSurInteret:"0"})
    this.entityForm.patchValue({commissionSurInteretMoratoire:"0"})

    let date=new Date(this.localStore.getData("currentSeance").dateFermeture)
    this.entityForm.patchValue({dateOperation: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});

    this.entityForm.patchValue({dateValeur: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});
    this.quantiteAmortie=0
    this.NominalRemb=0
    this.qteDetenue=0
    this.couponDivUnitaire=0
    this.montantRemb=0
    this.couponDividendeTotal=0

    this.commission=0
    this.irvm=0
    this.interetMoratoireCapital=0
    this.interetMoratoireInteret=0

    // this.afficherIntervenant()
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.dateFermeture=this.localStore.getData("currentSeance")?.dateFermeture

    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.idOpcvm
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification d'avis d'evenement sur valeur")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          console.log("profil=",entity.data)
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
    {
      this.pageInfo.updateTitle("Ajout d'avis d'evenement sur valeur")
      this.entityForm.patchValue({idOperation:"EN CRÉATION"})
    }

  }
  afficherDetachement(){
    let typeEvenement=this.entityForm.value.typeEvenement
    this.detachementService.afficherTous(this.idOpcvm,false,typeEvenement).subscribe(
      (data)=>{
        this.operationDetachement$=data.data
        // console.log(this.operationDetachement$)
      }
    )
  }
  onQuantiteAmortieKeyPress($event) {
    this.quantiteAmortie=$event.target.value.replace(',','.')
    if(!this.bQtiteAMORT)
    {
      this.capitalRemb()
      this.montantARecevoir()
    }
  }
  onNominalRembKeyPress($event) {
    // console.log("pass")
    this.NominalRemb=$event.target.value.replace(',','.')
    if(!this.bQtiteAMORT)
    {
      this.capitalRemb()
      this.montantARecevoir()
    }
  }
  onQteDetenueKeyPress($event) {
    this.qteDetenue=$event.target.value.replace(',','.')
    if(this.qteDetenue!==0)
    {
      this.couponDivTotal()
      this.montantARecevoir()
    }
  }
  onMontantRembKeyPress($event) {
    this.montantRemb=$event.target.value.replace(',','.')
    // if(this.commission!==0)
      this.montantARecevoir()
  }
  onCommissionKeyPress($event) {
    this.commission=$event.target.value.replace(',','.')
    // if(this.commission!==0)
      this.montantARecevoir()
  }
  onIrvmKeyPress($event) {
    this.irvm=$event.target.value.replace(',','.')
    // if(this.commission!==0)
      this.montantARecevoir()
  }
  onIntmorcapitalKeyPress($event) {
    this.interetMoratoireCapital=$event.target.value.replace(',','.')
    // if(this.commission!==0)
      this.montantARecevoir()
  }
  onIntmorinteretKeyPress($event) {
    this.interetMoratoireInteret=$event.target.value.replace(',','.')
    // if(this.commission!==0)
      this.montantARecevoir()
  }
  onCouponDivUnitaireKeyPress($event) {
    this.couponDivUnitaire=$event.target.value.replace(',','.')
    if(this.qteDetenue!==0)
    {
      this.couponDivTotal()
      this.montantARecevoir()
    }
  }
  onCouponDivTotalKeyPress($event) {
    this.couponDividendeTotal=$event.target.value.replace(',','.')
    // if(this.commission!==0)
      this.montantARecevoir()
  }
  afficherTitre(){
    // this.entityForm.patchValue({quantiteAmortie:"0"})
    // this.entityForm.patchValue({nominalRemb:"0"})
    // this.entityForm.patchValue({capitalRembourse:"0"})
    // this.entityForm.patchValue({qteDetenue:"0"})
    // this.entityForm.patchValue({couponDividendeUnitaire:"0"})
    // this.entityForm.patchValue({couponDividendeTotal:"0"})
    // this.entityForm.patchValue({montantTotalARecevoir:"0"})
    // this.loadingService.setLoading(true)
    // let typeEVenement=this.entityForm.value.typeEvenement
    //
    // if(typeEVenement==="DIVIDENDE"){
    //   this.typePayementVisible=false
    // }
    // else
    //   this.typePayementVisible=true
    this.idTitre=this.entityForm.value.operationDetachement.titre.idTitre
    this.titreService.getById(this.idTitre).subscribe(
      (data)=>{
        this.titre$=data.data
        this.titre=data.data
        // this.loadingService.setLoading(false)
      }
    )
    // if(typeEVenement==="DIVIDENDE"){
    //   this.bQtiteAMORT = true;
    //   this.bNominalRemb = true;
    // }
    // else
    // {
    //   this.bQtiteAMORT = false;
    //   this.bNominalRemb = false;
    // }

  }
  detachementChange(){
    if(this.entityForm.value.operationDetachement!=null){
      // console.log(this.entityForm.value.operationDetachement)
      this.entityForm.patchValue({typePayement: this.entityForm.value.operationDetachement.typePayement});
      let typePayement=this.entityForm.value.operationDetachement.typePayement
      switch (typePayement.trim())
      {
        case "":
          this.bQtiteAMORT = true;
          this.bNominalRemb = true;
          break;
        case "CAPITAL + INTERET":
          this.bQtiteAMORT = false;
          this.bNominalRemb = false;
          this.bCoupDivUnit = false;
          break;

        case "INTERET":
          this.bQtiteAMORT = true;
          this.bNominalRemb = true;
          this.bCoupDivUnit = false;
          break;

        case "CAPITAL":
          this.bQtiteAMORT = false;
          this.bNominalRemb = false;
          this.bCoupDivUnit = true;
          // meb_coupDivUnit.Value = 0;
          // meb_mtantCoupDivTot.Value = 0;
          break;
      }
      this.detachementService.getById(this.entityForm.value.operationDetachement.idOperation).subscribe(
        (data)=>{
          this.entityForm.patchValue({symboleTitre: data.data.titre.symbolTitre});
          this.entityForm.patchValue({codeTypeTitre: data.data.titre.typeTitre.codeTypeTitre});
          this.entityForm.patchValue({designation:  data.data.titre.designationTitre});
          this.entityForm.patchValue({idTitre:  data.data.titre.idTitre});
          this.entityForm.patchValue({intervenant:  data.data.intervenant.denomination});
          this.entityForm.patchValue({idIntervenant:  data.data.intervenant.idPersonne});
        }
      )

      this.entityForm.patchValue({quantiteAmortie:this.entityForm.value.operationDetachement.quantiteAmortie.toString().replace('.',',')})
      this.quantiteAmortie=this.entityForm.value.operationDetachement.quantiteAmortie

      this.entityForm.patchValue({nominalRemb:this.entityForm.value.operationDetachement.nominalRemb.toString().replace('.',',')})
      this.NominalRemb=this.entityForm.value.operationDetachement.nominalRemb

      this.entityForm.patchValue({capitalRembourse:this.entityForm.value.operationDetachement.capitalRembourse.toString().replace('.',',')})
      this.montantRemb=this.entityForm.value.operationDetachement.capitalRembourse

      this.entityForm.patchValue({qteDetenue:this.entityForm.value.operationDetachement.qteDetenue.toString().replace('.',',')})
      this.qteDetenue=this.entityForm.value.operationDetachement.qteDetenue

      this.entityForm.patchValue({couponDividendeUnitaire:this.entityForm.value.operationDetachement.couponDividendeUnitaire.toString().replace('.',',')})
      this.couponDivUnitaire=this.entityForm.value.operationDetachement.couponDividendeUnitaire

      this.entityForm.patchValue({couponDividendeTotal:this.entityForm.value.operationDetachement.montantBrut.toString().replace('.',',')})
      this.couponDividendeTotal=this.entityForm.value.operationDetachement.montantBrut

      this.entityForm.patchValue({montantTotalARecevoir:this.entityForm.value.operationDetachement.montantTotalARecevoir.toString().replace('.',',')})

      this.entityForm.patchValue({commission:"0"})
      this.entityForm.patchValue({irvm:"0"})
      this.entityForm.patchValue({interetMoratoireSurCapital:"0"})
      this.entityForm.patchValue({interetMoratoireSurInteret:"0"})
      this.entityForm.patchValue({commissionSurInteretMoratoire:"0"})

      this.commission=0
      this.irvm=0
      this.interetMoratoireCapital=0
      this.interetMoratoireInteret=0
    }

  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    console.log(this.entity)
    this.entityForm.patchValue({idOperation:"-"});
    let dateOperation = new Date(entity.dateOperation);
    this.entityForm.patchValue({dateOperation: new NgbDate(
        dateOperation.getFullYear(), dateOperation.getMonth()+1, dateOperation.getDate())});

    let dateValeur = new Date(entity.dateValeur);
    this.entityForm.patchValue({dateValeur: new NgbDate(
        dateValeur.getFullYear(), dateValeur.getMonth()+1, dateValeur.getDate())});
    // this.idTitre=entity.titre.idTitre
    this.entityForm.patchValue({idIntervenant:  entity.intervenant.idPersonne.toString()});
    this.entityForm.patchValue({idTitre:  entity.titre.idTitre.toString()});

    this.entityForm.patchValue({designation: entity.titre.designationTitre});
    this.entityForm.patchValue({symboleTitre: entity.titre.symbolTitre});
    this.entityForm.patchValue({codeTypeTitre:entity.titre.typeTitre.codeTypeTitre})
    this.entityForm.patchValue({id: entity.idOperation});
    this.entityForm.patchValue({typeEvenement: entity.typeEvenement});
    this.entityForm.patchValue({referenceAvis: entity.referencePiece});
    this.entityForm.patchValue({typePayement: entity.typePayement});
    this.afficherDetachement()
    this.entityForm.patchValue({operationDetachement:entity.operationDetachement});
    this.entityForm.patchValue({intervenant: entity.intervenant.denomination});
    this.entityForm.patchValue({quantiteAmortie:entity.quantiteAmortie.toString()})
    this.quantiteAmortie=entity.quantiteAmortie

    this.entityForm.patchValue({nominalRemb:entity.nominalRemb.toString()})
    this.NominalRemb=entity.nominalRemb

    this.entityForm.patchValue({capitalRembourse:entity.capitalRembourse.toString()})
    this.montantRemb=entity.capitalRembourse

    this.entityForm.patchValue({qteDetenue:entity.qteDetenue.toString()})
    this.qteDetenue=entity.qteDetenue

    this.entityForm.patchValue({couponDividendeUnitaire:entity.couponDividendeUnitaire.toString()})
    this.couponDivUnitaire=entity.couponDividendeUnitaire

    this.entityForm.patchValue({couponDividendeTotal:entity.montantBrut.toString()})
    this.couponDividendeTotal=entity.montantBrut

    this.entityForm.patchValue({montantTotalARecevoir:entity.montantTotalARecevoir.toString()})

    this.entityForm.patchValue({commission:entity.commission.toString()})
    this.entityForm.patchValue({irvm:entity.irvm.toString()})
    this.entityForm.patchValue({interetMoratoireSurCapital:entity.interetMoratoireSurCapital.toString()})
    this.entityForm.patchValue({interetMoratoireSurInteret:entity.interetMoratoireSurInteret.toString()})
    // this.entityForm.patchValue({commissionSurInteretMoratoire:"0"})

    this.commission=entity.commission
    this.irvm=entity.irvm
    this.interetMoratoireCapital=entity.interetMoratoireSurCapital
    this.interetMoratoireInteret=entity.interetMoratoireSurInteret

  }
  afficherIntervenant(){
    this.personneService.afficherPersonneSelonQualite("REGISTRAIRES").subscribe(
      (data)=>{
        this.personne$=data
      }
    )
  }
  afficherQuantiteReel(){
    let dateOperation: any;
    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    // dateOperation=moment(dateOperation).format('YYYY-MM-DD')
    const entity={
      dateTimeParametre:dateOperation,
      idOpcvm:this.idOpcvm,
      idTitre:this.idTitre
    }
    // console.log("entityreel=",entity)
    this.formuleService.quantiteReel(entity).subscribe(
      (data)=>{
        // this.formule$=data.data
        // console.log(data.data)
        this.entityForm.patchValue({qteDetenue:data.data})
        this.qteDetenue=data.data
      }
    )
  }
  afficherDerniereEcheance(){
    let dateOperation: any;
    // if(this.entityForm.controls.dateOperation.value)
    // {
    dateOperation =  this.dateFermeture;
    // if(this.entityForm.controls.dateOperation.value)
    // {
    //   dateOperation = new Date(
    //     this.entityForm.controls.dateOperation.value.year,
    //     this.entityForm.controls.dateOperation.value.month-1,
    //     this.entityForm.controls.dateOperation.value.day+1);
    // }
    const entity={
      dateTimeParametre:dateOperation,
      idOpcvm:this.idOpcvm,
      idTitre:this.idTitre
    }
    // }
    console.log(entity)
    this.formuleService.derniereEcheance(entity).subscribe(
      (data)=>{
        // this.formule$=data.data
        console.log(data.data)
        let dateEcheance = new Date(data.data);
        this.entityForm.patchValue({dateReelle: new NgbDate(
            dateEcheance.getFullYear(), dateEcheance.getMonth()+1, dateEcheance.getDate())});
        // this.typePayementChange()
        // this.entityForm.patchValue({dateReelle:dateEcheance})
      }
    )
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  typePayementChange(){
    if(!this.idTitre)
    {
      // this.loadingService.setLoading(false)
      return
    }


    let dateOperation: any;
    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    let dateReelle: any;
    if(this.entityForm.controls.dateReelle.value)
    {
      dateReelle = new Date(
        this.entityForm.controls.dateReelle.value.year,
        this.entityForm.controls.dateReelle.value.month-1,
        this.entityForm.controls.dateReelle.value.day+1);
    }
    let dateValeur: any;
    if(this.entityForm.controls.dateValeur.value)
    {
      dateValeur = new Date(
        this.entityForm.controls.dateValeur.value.year,
        this.entityForm.controls.dateValeur.value.month-1,
        this.entityForm.controls.dateValeur.value.day+1);
    }

    let typeEvenement=this.entityForm.value.typeEvenement
    let typePayement=this.entityForm.value.typePayement

    if(typeEvenement==="DIVIDENDE")
      typePayement=""
    let titre=new TitreModel()
    titre.idTitre=this.idTitre
    const entity={
      ...this.entityForm.value,
      titre:titre,
      idOperation:0,
      typePayement:typePayement,
      opcvm:this.opcvm,
      dateOperation:dateOperation,
      dateValeur:dateValeur,
      dateReelle:dateReelle
    }
    this.entityService.valeurOuQte(entity).subscribe(
      (data)=>{
        let entity=data.data
        if(entity.nominalRemb)
        {
          this.entityForm.patchValue({nominalRemb:entity.nominalRemb.toString()})
          this.NominalRemb=entity.nominalRemb
        }
        else
        {
          this.entityForm.patchValue({nominalRemb :"0"})
          this.NominalRemb=0
        }
        if(entity.couponDividendeUnitaire)
        {
          this.entityForm.patchValue({couponDividendeUnitaire :entity.couponDividendeUnitaire.toString()})
          this.couponDivUnitaire=entity.couponDividendeUnitaire
        }
        else
        {
          this.entityForm.patchValue({couponDividendeUnitaire :"0"})
          this.couponDivUnitaire=0
        }

        if(entity.quantiteAmortie)
        {
          this.entityForm.patchValue({quantiteAmortie :entity.quantiteAmortie.toString()})
          this.quantiteAmortie=entity.quantiteAmortie
        }
        else
        {
          this.entityForm.patchValue({quantiteAmortie :"0"})
          this.quantiteAmortie=0
        }

        if(entity.capitalRembourse)
          this.entityForm.patchValue({capitalRembourse :entity.capitalRembourse.toString()})
        else
          this.entityForm.patchValue({capitalRembourse :"0"})

        if(entity.couponDividendeTotal)
          this.entityForm.patchValue({couponDividendeTotal :entity.couponDividendeTotal.toString()})
        else
          this.entityForm.patchValue({couponDividendeTotal :"0"})

        if(entity.montantTotalARecevoir)
          this.entityForm.patchValue({montantTotalARecevoir :entity.montantTotalARecevoir.toString()})
        else
          this.entityForm.patchValue({montantTotalARecevoir :"0"})

        this.libelleModeAmortissement=entity.libelleModeAmortissement
        console.log(this.libelleModeAmortissement)

        this.bNominalRemb=entity.bNominalRemb
        this.bCoupDivUnit=entity.bCoupDivUnit
        this.bQtiteAMORT=entity.bQtiteAMORT
        // console.log("qteamort=",entity.bQtiteAMORT)
        // console.log("bCoupDivUnit=",entity.bCoupDivUnit)
        // console.log("bNominalRemb=",entity.bNominalRemb)
        console.log("entity=",entity)
        // this.loadingService.setLoading(false)
      }
    )

    typeEvenement=this.entityForm.value.typeEvenement
    if(typeEvenement==="DIVIDENDE"){
      return
    }

    typePayement=this.entityForm.value.typePayement
    console.log(typePayement)
    switch (typePayement)
    {
      case "CAPITAL + INTERET":
        //meb_qtiteAMORT.ReadOnly=false;
        // console.log("1")
        this.bNominalRemb=false
        this.bCoupDivUnit=false

        // this.capitalRemb();
        // this.couponDivTotal();
        break;

      case "INTERET":
        // console.log("2")
        this.bQtiteAMORT=true
        this.bNominalRemb=true
        this.bCoupDivUnit=false
        //meb_qtiteAMORT.Value = 0;
        // this.entityForm.patchValue({nominalRemb:"0"})
        // this.entityForm.patchValue({capitalRembourse:"0"})
        //
        // this.couponDivTotal();
        break;

      case "CAPITAL":
        // console.log("3")
        //meb_qtiteAMORT.ReadOnly = false;
        this.bNominalRemb = false;
        this.bCoupDivUnit= true;
        // this.entityForm.patchValue({couponDividendeUnitaire:"0"})
        // this.entityForm.patchValue({couponDividendeTotal:"0"})
        //
        //  this.capitalRemb();
        break;
    }
  }
  couponDivTotal(){

    this.entityForm.patchValue({couponDividendeTotal:Math.round(this.qteDetenue*this.couponDivUnitaire).toString()})
    this.couponDividendeTotal=Math.round(this.qteDetenue*this.couponDivUnitaire)
  }
  capitalRemb()
  {
    try
    {

      let nominalRemb:number=this.NominalRemb;

      let quantiteAmortie:number=this.quantiteAmortie;

      this.entityForm.patchValue({capitalRembourse:(quantiteAmortie*nominalRemb).toString()})
      this.montantRemb=quantiteAmortie*nominalRemb
    }
    catch { }

  }

  montantARecevoir()
  {
    this.codeTypeTitre=this.entityForm.value.codeTypeTitre
    this.codeTypeTitre=this.codeTypeTitre.trim().toUpperCase()
      if (this.codeTypeTitre === "ACTION" ||
        this.codeTypeTitre === "OBLIGATN" ||
        this.codeTypeTitre === "OBLIGATI" ||
        this.codeTypeTitre === "BOT" ||
        this.codeTypeTitre === "BIT")
      {
        let montantTotalARecevoir:number=0
        montantTotalARecevoir=Number(this.montantRemb)+Number(this.couponDividendeTotal)+
          Number(this.interetMoratoireCapital)+Number(this.interetMoratoireInteret)-
          Number(this.commission)+Number(this.irvm)
        console.log(montantTotalARecevoir)
          this.entityForm.patchValue({montantTotalARecevoir:montantTotalARecevoir.toString()})
      }
      else
      {
        let montantTotalARecevoir:number=0
        montantTotalARecevoir=Number(this.montantRemb)+
          Number(this.interetMoratoireCapital)+Number(this.interetMoratoireInteret)-
          Number(this.commission)+Number(this.irvm)
        this.entityForm.patchValue({montantTotalARecevoir:montantTotalARecevoir.toString()})
      }

  }
  get f() { return this.entityForm.controls; }
  addRow(id: string) {
    // @ts-ignore
    this.tableau = document.getElementById(id);
    var nbreLigne = this.tableau.getElementsByTagName('tr').length
    var ajouter = true;

    // if(nbreLigne==0){
    //   ajouter=true;
    // }
    // for (let i = 1; i < nbreLigne; i++) {
    //   if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML===this.personne.idPersonne.toString()) {
    //     ajouter = false;
    //   }
    // }
    if (ajouter) {
      var tr = document.createElement('tr'); //On créé une ligne
      var td = document.createElement('td');
      tr.appendChild(td);
      td.innerHTML = this.entityForm.value.borneInferieur
      // @ts-ignore
      if (this.tableau.firstChild.tagName == 'TBODY') {
        // @ts-ignore
        this.tableau.firstChild.appendChild(tr);
      } else {
        this.tableau.appendChild(tr);
      }
      // td.hidden = true;
      var td = document.createElement('td');
      tr.appendChild(td);
      td.innerHTML = this.entityForm.value.borneSuperieur;
      // @ts-ignore
      if (this.tableau.firstChild.tagName == 'TBODY') {
        // @ts-ignore
        this.tableau.firstChild.appendChild(tr);
      } else {
        this.tableau.appendChild(tr);
      }

      var td = document.createElement('td');
      tr.appendChild(td);
      td.innerHTML = this.entityForm.value.montantMinimum;
      // @ts-ignore
      if (this.tableau.firstChild.tagName == 'TBODY') {
        // @ts-ignore
        this.tableau.firstChild.appendChild(tr);
      } else {
        this.tableau.appendChild(tr);
      }

      var td = document.createElement('td');
      tr.appendChild(td);
      td.innerHTML = this.entityForm.value.taux;
      // @ts-ignore
      if (this.tableau.firstChild.tagName == 'TBODY') {
        // @ts-ignore
        this.tableau.firstChild.appendChild(tr);
      } else {
        this.tableau.appendChild(tr);
      }

      var buttonElement = document.createElement('button');
      // buttonElement.className="buttonSupprimer";
      buttonElement.style.alignContent = "center";
      buttonElement.style.borderStyle = "none";
      buttonElement.style.marginTop = "5 px";
      // @ts-ignore
      // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
      var _this = this;
      buttonElement.addEventListener("click", function (evt) {
        return _this.removeLine(tr.rowIndex);
      });
      // buttonElement.onclick=this.removeLine(tr.rowIndex);
      tr.appendChild(buttonElement);
      buttonElement.innerHTML = "X";

      // @ts-ignore
      if (this.tableau.firstChild.tagName == 'TBODY') {
        // @ts-ignore
        this.tableau.firstChild.appendChild(tr);
      } else {
        this.tableau.appendChild(tr);
      }
    }
  }
  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_PersonneOpcvm");
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
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
    // this.loadingService.setLoading(true)
    this.idTitre=item.idTitre
    // this.symbolTitre=item.symbolTitre
    // // console.log(this.symbolTitre)
    this.titreService.getById(item.idTitre).subscribe(
      (data)=>{
        this.titreSelonId=data.data
        this.entityForm.patchValue({designation:this.titreSelonId.designationTitre})
        this.entityForm.patchValue({codeTypeTitre:this.titreSelonId.typeTitre.codeTypeTitre})
        this.afficherQuantiteReel()
        this.afficherDerniereEcheance()

      }
    )
    let typeEvenement=this.entityForm.value.typeEvenement
    if(typeEvenement==="DIVIDENDE")
      this.typePayementChange()
    // this.afficherQuantiteReel()
    // this.afficherDerniereEcheance()
    // this.typePayementChange()
  }
  titreChange(){
    this.idTitre=this.entityForm.value.titre.idTitre
    // this.symbolTitre=item.symbolTitre
    // // console.log(this.symbolTitre)
    this.titreService.getById(this.idTitre).subscribe(
      (data)=>{
        this.titreSelonId=data.data
        this.entityForm.patchValue({designation:this.titreSelonId.designationTitre})
        this.entityForm.patchValue({codeTypeTitre:this.titreSelonId.typeTitre.codeTypeTitre})
        this.afficherQuantiteReel()
        this.afficherDerniereEcheance()

      }
    )
    let typeEvenement=this.entityForm.value.typeEvenement
    if(typeEvenement==="DIVIDENDE")
      this.typePayementChange()
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
    this.idTitre=0
    this.entityForm.patchValue({designation:''})
    this.entityForm.patchValue({cotation:''})
    this.entityForm.patchValue({depositaire:''})
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  onSaveEntity()
  {

    this.isLoading = true;
    this.submitted = true;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/opcvm/avisevenementsurvaleur/liste']);
        })
      )
      .subscribe(
        (data)=> {

        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    let intervenant:Personne=new Personne();
    intervenant.idPersonne=this.entityForm.value.idIntervenant

    let dateOperation: any;
    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    let dateSaisie=new Date();
    let dateValeur: any;
    if(this.entityForm.controls.dateValeur.value)
    {
      dateValeur = new Date(
        this.entityForm.controls.dateValeur.value.year,
        this.entityForm.controls.dateValeur.value.month-1,
        this.entityForm.controls.dateValeur.value.day+1);
    }
    let datePiece=dateOperation

    let montantTotalARecevoir=0
    if(this.entityForm.controls.montantTotalARecevoir.value)
    {
      montantTotalARecevoir=this.entityForm.value.montantTotalARecevoir
    }
    this.idTitre=this.entityForm.value.idTitre
    let titre=new TitreModel();
    titre.idTitre=this.idTitre

    let typeEvenement=""
    if(this.entityForm.controls.typeEvenement.value)
    {
      typeEvenement=this.entityForm.value.typeEvenement
    }

    let couponDividendeTotal=0
    if(this.entityForm.controls.couponDividendeTotal.value)
    {
      couponDividendeTotal=this.entityForm.value.couponDividendeTotal
    }

    let typePayement=""
    if (this.entityForm.controls.typePayement.value) {
      typePayement = this.entityForm.value.typePayement
    }

    let idOperation=0
    let estPaye=false
    if (this.entityForm.controls.estPaye.value) {
      estPaye = this.entityForm.value.estPaye
    }
    if(this.id)
      idOperation=this.id

    const entity: any = {
      ...this.entityForm.value,
      idSeance : this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance,
      idTransaction : 0,
      idOperation:idOperation,
      dateOperation :dateOperation,
      dateSaisie :dateSaisie,
      dateValeur :dateValeur,
      datePiece:datePiece,
      referencePiece:this.entityForm.value.referenceAvis,
      intervenant:intervenant,
      montant :montantTotalARecevoir,
      commissionSurInteretMoratoire :0,
      ecriture:"A",
      estOD :false,
      estPaye :estPaye,
      type : "DC",
      titre:titre,
      typeEvenement:typeEvenement,
      typePayement :typePayement,
      montantBrut:couponDividendeTotal,
      opcvm:this.opcvm,
      valeurCodeAnalytique:"OPC:" + this.idOpcvm.toString() +
        ";TIT:" + this.idTitre.toString(),
      userLogin:this.authService.currentUserValue?.username
    };

    const entityOperation={
      ...this.entityForm.value,
      idSeance : this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance,
      idTransaction:0,
      idOperation:0,
      intervenant:intervenant,
      dateOperation:dateOperation,
      dateSaisie:dateSaisie,
      dateValeur:dateValeur,
      datePiece:datePiece,
      referencePiece:this.entityForm.value.referenceAvis,
      montantBrut:couponDividendeTotal,
      ecriture:"A",
      estOD: false,
      type:"DC",
      titre:titre,
      opcvm:this.opcvm,
      valeurCodeAnalytique: "OPC:"+this.idOpcvm.toString()+";TIT:"+this.idTitre.toString(),
      userLogin:this.authService.currentUserValue?.username
    }
    let operation:Operationevenementsurvaleur[]=[]
    operation.push(entityOperation)
    operation.push(entity)
    console.log("act1",entity)
    console.log("act2",entityOperation)
    return this.id
      ? this.entityService.modifier(entity)
      : this.entityService.create(operation);
  }
}
