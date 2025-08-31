import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Detailprofil} from "../../../models/detailprofil.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {OperationdetachementService} from "../../../services/operationdetachement.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {TitreService} from "../../../../titresciel/services/titre.service";
import {LoaderService} from "../../../../loader.service";
import {FormuleService} from "../../../../core/services/formule.service";
import moment from "moment";
import {TitreModel} from "../../../../titresciel/models/titre.model";
import {TcnService} from "../../../../titresciel/services/tcn.service";
import {ObligationService} from "../../../../titresciel/services/obligation.service";

@Component({
    selector: 'app-operationdetachement-add-edit',
    templateUrl: './operationdetachement-add-edit.component.html',
    styleUrl: './operationdetachement-add-edit.component.scss',
    standalone: false
})
export class OperationdetachementAddEditComponent implements OnInit, OnDestroy{
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
  couponDivUnitaire:number;
  libelleModeAmortissement:any;
  public titreSettings = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: OperationdetachementService,
    public detailProfilService: DetailprofilService,
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
        titre: [null,Validators.required],
        designation: [null],
        dateReelle: [null,Validators.required],
        quantiteAmortie: [null,Validators.required],
        nominalRemb: [null,Validators.required],
        capitalRembourse: [null,Validators.required],
        qteDetenue: [null,Validators.required],
        couponDividendeUnitaire: [null,Validators.required],
        couponDividendeTotal: [null,Validators.required],
        montantTotalARecevoir: [null,Validators.required],
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

    let date=new Date(this.localStore.getData("currentSeance").dateFermeture)
    this.entityForm.patchValue({dateOperation: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});

    this.entityForm.patchValue({dateValeur: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});
    this.quantiteAmortie=0
    this.NominalRemb=0
    this.qteDetenue=0
    this.couponDivUnitaire=0

    this.afficherIntervenant()
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.dateFermeture=this.localStore.getData("currentSeance")?.dateFermeture

    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.idOpcvm
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de détachement")
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
      this.pageInfo.updateTitle("Ajout de détachement")
      this.entityForm.patchValue({idOperation:"EN CRÉATION"})
    }

  }
  onQuantiteAmortieKeyPress($event) {
    this.quantiteAmortie=$event.target.value
    this.capitalRemb()
  }
  onNominalRembKeyPress($event) {
    // console.log("pass")
    this.NominalRemb=$event.target.value
    this.capitalRemb()
  }
  onQteDetenueKeyPress($event) {
    this.qteDetenue=$event.target.value

    this.couponDivTotal()
  }
  onCouponDivUnitaireKeyPress($event) {
    this.couponDivUnitaire=$event.target.value

    this.couponDivTotal()
  }
  afficherTitre(){
    this.entityForm.patchValue({quantiteAmortie:"0"})
    this.entityForm.patchValue({nominalRemb:"0"})
    this.entityForm.patchValue({capitalRembourse:"0"})
    this.entityForm.patchValue({qteDetenue:"0"})
    this.entityForm.patchValue({couponDividendeUnitaire:"0"})
    this.entityForm.patchValue({couponDividendeTotal:"0"})
    this.entityForm.patchValue({montantTotalARecevoir:"0"})
    // this.loadingService.setLoading(true)
    let typeEVenement=this.entityForm.value.typeEvenement

    if(typeEVenement==="DIVIDENDE"){
      this.typePayementVisible=false
    }
    else
      this.typePayementVisible=true

    this.entityService.afficherTitre(this.localStore.getData("currentOpcvm")?.idOpcvm,
      this.localStore.getData("currentSeance")?.dateFermeture,typeEVenement).subscribe(
      (data)=>{
        this.titre$=data.data
        this.titre=data.data
        // this.loadingService.setLoading(false)
      }
    )
    if(typeEVenement==="DIVIDENDE"){
      this.bQtiteAMORT = true;
      this.bNominalRemb = true;
    }
    else
    {
      this.bQtiteAMORT = false;
      this.bNominalRemb = false;
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

   let dateReelle = new Date(entity.dateReelle);
      this.entityForm.patchValue({dateReelle: new NgbDate(
          dateReelle.getFullYear(), dateReelle.getMonth()+1, dateReelle.getDate())});

    this.entityForm.patchValue({titre: entity.titre});
    this.idTitre=entity.titre.idTitre
    this.afficherTitre()
    this.entityForm.patchValue({designation: entity.titre.designationTitre});
    this.entityForm.patchValue({codeTypeTitre:entity.titre.typeTitre.codeTypeTitre})
    this.entityForm.patchValue({id: entity.idOperation});
    this.entityForm.patchValue({estPaye: entity.estPaye});
    this.entityForm.patchValue({typeEvenement: entity.typeEvenement});
    this.entityForm.patchValue({typePayement: entity.typePayement});
    this.entityForm.patchValue({intervenant: entity.intervenant});
    this.entityForm.patchValue({quantiteAmortie:entity.quantiteAmortie.toString()})
    this.quantiteAmortie=entity.quantiteAmortie
    this.entityForm.patchValue({nominalRemb:entity.nominalRemb.toString()})
    this.NominalRemb=entity.nominalRemb
    this.entityForm.patchValue({capitalRembourse:entity.capitalRembourse.toString()})
    this.entityForm.patchValue({qteDetenue:entity.qteDetenue.toString()})
    this.qteDetenue=entity.qteDetenue
    this.entityForm.patchValue({couponDividendeUnitaire:entity.couponDividendeUnitaire.toString()})
    this.couponDivUnitaire=entity.couponDividendeUnitaire

    this.entityForm.patchValue({couponDividendeTotal:entity.montantBrut.toString()})
    this.entityForm.patchValue({montantTotalARecevoir:entity.montantTotalARecevoir.toString()})

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
    let couponDividendeUnitaire:number=this.couponDivUnitaire;
    // if(this.entityForm.controls.couponDividendeUnitaire.value){
    //   couponDividendeUnitaire=this.entityForm.value.couponDividendeUnitaire
    // }

    let quantiteAmortie:number=0;
    if(this.entityForm.controls.quantiteAmortie.value){
      quantiteAmortie=this.entityForm.value.quantiteAmortie
    }
    let nominalRemb:number=0;
    if(this.entityForm.controls.nominalRemb.value){
      nominalRemb=this.entityForm.value.nominalRemb
    }

    this.entityForm.patchValue({couponDividendeTotal:Math.round(this.qteDetenue*couponDividendeUnitaire).toString()})
    let couponDividendeTotal=Math.round(this.qteDetenue*couponDividendeUnitaire)
    // console.log(this.qteDetenue)
    // console.log(couponDividendeUnitaire)
    this.entityForm.patchValue({montantTotalARecevoir :(Number(quantiteAmortie)*Number(nominalRemb)+Number(couponDividendeTotal)).toString()})
    // meb_mtantCoupDivTot.Value = decimal.Round(Convert.ToDecimal(meb_QtiteDetenue.Value) *
    //   Convert.ToDecimal(meb_coupDivUnit.Value));
  }
  capitalRemb()
  {
    try
    {
      let qteDetenue:number=0;
      if(this.entityForm.controls.qteDetenue.value){
        qteDetenue=this.entityForm.value.qteDetenue
      }
      // console.log(qteDetenue)
      let couponDividendeTotal:number=0;
      if(this.entityForm.controls.couponDividendeTotal.value){
        couponDividendeTotal=this.entityForm.value.couponDividendeTotal
      }
      let nominalRemb:number=this.NominalRemb;
      // if(this.entityForm.controls.nominalRemb.value){
      //   nominalRemb=this.entityForm.value.nominalRemb
      // }
      // console.log(nominalRemb)

      let quantiteAmortie:number=this.quantiteAmortie;
      // if(this.entityForm.controls.quantiteAmortie.value){
      //   quantiteAmortie=this.entityForm.value.quantiteAmortie
      // }
      // console.log(quantiteAmortie)
      let codeTypeTitre:string="";
      if(this.entityForm.controls.codeTypeTitre.value){
        codeTypeTitre=this.entityForm.value.codeTypeTitre
      }
      codeTypeTitre=codeTypeTitre.trim().toUpperCase()
      // console.log(codeTypeTitre)
      this.loadingService.setLoading(true)
      if ( codeTypeTitre==="OBLIGATI"||
        codeTypeTitre==="OBLIGATN")
      {
        this.obligationService.getById(this.idTitre).subscribe(
          (data)=>{
            this.tcn$=data.data
            if(this.tcn$!==null){
              console.log(this.tcn$)
              console.log(this.tcn$.modeAmortissement.libelleModeAmortissement)
              if (this.tcn$.modeAmortissement.libelleModeAmortissement.trim() === "SUR VALEUR")
              {

                let montant:number=Number(qteDetenue*nominalRemb)+Number(couponDividendeTotal)

                // console.log("montant",montant)
                this.entityForm.patchValue({capitalRembourse:(qteDetenue*nominalRemb).toString()})
                this.entityForm.patchValue({montantTotalARecevoir :(montant).toString()})
                this.loadingService.setLoading(false)
              }
              else
              {
                let montant:number=Number(quantiteAmortie*nominalRemb)+Number(couponDividendeTotal)
                this.entityForm.patchValue({capitalRembourse:(quantiteAmortie*nominalRemb).toString()})
                this.entityForm.patchValue({montantTotalARecevoir :(montant).toString()})
                this.loadingService.setLoading(false)
              }
            }
          }
        )
      }
      else
      if (
        codeTypeTitre==="BOT" || codeTypeTitre==="BIT" ||
        codeTypeTitre==="CED" ||
        codeTypeTitre==="BEFI")
      {
        this.tcnService.getById(this.idTitre).subscribe(
          (data)=>{
            this.tcn$=data.data
            // console.log(this.tcn$ad)
            if (this.tcn$.modeAmortissement.libelleModeAmortissement.trim() === "SUR VALEUR")
            {

              let montant:number=Number(qteDetenue*nominalRemb)+Number(couponDividendeTotal)

              // console.log("montant",montant)
              this.entityForm.patchValue({capitalRembourse:(qteDetenue*nominalRemb).toString()})
              this.entityForm.patchValue({montantTotalARecevoir :(montant).toString()})
              this.loadingService.setLoading(false)
            }
            else
            {
              let montant:number=Number(quantiteAmortie*nominalRemb)+Number(couponDividendeTotal)
              this.entityForm.patchValue({capitalRembourse:(quantiteAmortie*nominalRemb).toString()})
              this.entityForm.patchValue({montantTotalARecevoir :(montant).toString()})
              this.loadingService.setLoading(false)
            }
          }
        )
      }

    }
    catch { }

  }

  // couponDivTotal()
  // {
  //   let qteDetenue:number=0;
  //   if(this.entityForm.controls.qteDetenue.value){
  //     qteDetenue=this.entityForm.value.qteDetenue
  //   }
  //   let couponDividendeUnitaire:number=0;
  //   if(this.entityForm.controls.couponDividendeUnitaire.value){
  //     couponDividendeUnitaire=this.entityForm.value.couponDividendeUnitaire
  //   }
  //   this.entityForm.patchValue({couponDividendeTotal:Math.round(qteDetenue*couponDividendeUnitaire).toString()})
  //
  // }
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
          this.router.navigate(['/opcvm/evenementsurvaleur/operationdetachement/liste']);
        })
      )
      .subscribe(
        (data)=> {

        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    let dateReelle: any;
    if(this.entityForm.controls.dateReelle.value)
    {
      dateReelle = new Date(
        this.entityForm.controls.dateReelle.value.year,
        this.entityForm.controls.dateReelle.value.month-1,
        this.entityForm.controls.dateReelle.value.day+1);
    }
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
    if(typeEvenement==="COUPON") {
      if (this.entityForm.controls.typePayement.value) {
        typePayement = this.entityForm.value.typePayement
      }
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
      dateReelle :dateReelle,
      dateOperation :dateOperation,
      dateSaisie :dateSaisie,
      dateValeur :dateValeur,
      datePiece:datePiece,
      referencePiece:"-",
      montant :montantTotalARecevoir,
      ecriture:"A",
      estOD :false,
      estPaye :estPaye,
      type : "DC",
      titre:titre,
      typeEvenement:typeEvenement,
      typePayement :typePayement,
      montantBrut:couponDividendeTotal,
      opcvm:this.opcvm,
      libelleModeAmortissement:this.libelleModeAmortissement,
      valeurCodeAnalytique:"OPC:" + this.idOpcvm.toString() +
        ";TIT:" + this.idTitre.toString(),
      userLogin:this.authService.currentUserValue?.username
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(entity)
      : this.entityService.create(entity);
  }
}
