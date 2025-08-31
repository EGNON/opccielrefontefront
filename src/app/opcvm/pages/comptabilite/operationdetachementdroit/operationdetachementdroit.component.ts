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
import {OperationdetachementdroitService} from "../../../services/operationdetachementdroit.service";
import {DroitService} from "../../../../titresciel/services/droit.service";
import {DroitModel} from "../../../../titresciel/models/droit.model";

@Component({
    selector: 'app-operationdetachementdroit',
    templateUrl: './operationdetachementdroit.component.html',
    styleUrl: './operationdetachementdroit.component.scss',
    standalone: false
})
export class OperationdetachementdroitComponent implements OnInit, OnDestroy{
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
  valueDate:Date;
  tcn$:any;
  idTitre:any;
  idActionLiee:any;
  titre:DroitModel[];
  idOpcvm:any;
  dateFermeture:any;
  operationDetachementDroit:any;
  bNominalRemb=false;
  bCoupDivUnit= false;
  bQtiteAMORT = false;
  codeTypeTitre:string;
  quantiteAmortie:number;
  NominalRemb:number;
  qteDetenue:number;
  couponDivUnitaire:number;
  libelleModeAmortissement:any;
  public droitSettings = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: OperationdetachementdroitService,
    public detailProfilService: DetailprofilService,
    public personneService: PersonneService,
    public formuleService: FormuleService,
    public titreService: TitreService,
    public tcnService: TcnService,
    public droitService: DroitService,
    public obligationService: ObligationService,
    public loadingService: LoaderService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.idTitre=0
    let
    dateOperation=new Date(this.localStore.getData("currentSeance").dateFermeture);
    this.entityForm = this.fb.group({
      id:[null],
      droit:[null],
      droitSelectionne: [null,Validators.required],
      detachement: this.fb.group({
        referenceAvis: [''],
        dateOperation: [new NgbDate(
          dateOperation.getFullYear(), dateOperation.getMonth() + 1, dateOperation.getDate())],
        dateValeur: [new NgbDate(
          dateOperation.getFullYear(), dateOperation.getMonth() + 1, dateOperation.getDate())],
        qteAction: ['0'],
        qteDroit: ['0']
      }),

      conversion: this.fb.group({
        referenceAvis: [''],
        dateOperation: [''],
        dateValeur: [''],
        nombreDroit: [''],
        qteAttribuee: [''],
        nombreRompu: ['']
      }),

      paiementRompu: this.fb.group({
        referenceAvis: [''],
        dateOperation: [''],
        dateValeur: [''],
        nombreRompu: [''],
        coutCession: [''],
        montant: ['']
      })
    });
    this.entityForm.get('detachement.dateOperation')?.valueChanges.subscribe(value => {
      console.log('Changement de date :', value);
      this.valueDate=value;
      console.log(this.valueDate)
      this.afficherQuantiteReel()
    });
    this.droitSettings = {
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
    // this.paysSelect = document.getElementById("ComboPaysLab");
    // this.entityForm.patchValue({quantiteAmortie:"0"})
    // this.entityForm.patchValue({nominalRemb:"0"})
    // this.entityForm.patchValue({capitalRembourse:"0"})
    // this.entityForm.patchValue({qteDetenue:"0"})
    // this.entityForm.patchValue({couponDividendeUnitaire:"0"})
    // this.entityForm.patchValue({couponDividendeTotal:"0"})
    // this.entityForm.patchValue({montantTotalARecevoir:"0"})

    let date=new Date(this.localStore.getData("currentSeance").dateFermeture)
    this.entityForm.patchValue({dateOperation: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});

    this.entityForm.patchValue({dateValeur: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});
    this.quantiteAmortie=0
    this.NominalRemb=0
    this.qteDetenue=0
    this.couponDivUnitaire=0

    this.afficherTitre()
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
  afficherTitre(){

    this.entityService.afficherTitre().subscribe(
      (data)=>{
        this.titre$=data.data
        this.titre=data.data
        this.titre = data.data.map(t => ({
          ...t,
          affichage: `${t.symbolTitre} - ${t.pays?.nom ?? ''} - ${t.typeTitre?.nom ?? ''}`
        }));
        console.log(data.data)
        // this.loadingService.setLoading(false)
      }
    )

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
    this.loadingService.setLoading(true)
    if(this.idTitre===0)
    {
      alert('Veuillez selectionner un titre')
      this.loadingService.setLoading(false)
      return;
    }
    let dateOperation: any;
    if(this.entityForm.get('detachement.dateOperation')?.value)
    {
      dateOperation = new Date(
        this.entityForm.get('detachement.dateOperation').value.year,
        this.entityForm.get('detachement.dateOperation').value.month-1,
        this.entityForm.get('detachement.dateOperation').value.day+1);
    }
    // dateOperation=moment(dateOperation).format('YYYY-MM-DD')
    this.droitService.getById(this.idTitre).subscribe(
      (data)=>{
        console.log("actionliee=",data.data.actionLiee.idTitre)
        const entity={
          dateTimeParametre:dateOperation,
          idOpcvm:this.idOpcvm,
          idTitre:data.data.actionLiee.idTitre
        }

        this.formuleService.quantiteReel(entity).subscribe(
          (data)=>{
            // this.formule$=data.data
            console.log("qte=",data.data)
            this.entityForm.get('detachement').patchValue({qteAction:data.data})
            this.loadingService.setLoading(false)
            // this.qteDetenue=data.data
          }
        )
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
  afficherDetachement(){

  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
     console.log('onItemSelect', item);
    // this.loadingService.setLoading(true)
    this.idTitre=item.idTitre
    this.idActionLiee=item.pariteAncienCours
    console.log(this.entityForm.get('droit')?.value)
    // this.symbolTitre=item.symbolTitre
    // // console.log(this.symbolTitre)
    this.entityService.afficherTous(this.idOpcvm,item.idTitre).subscribe(
      (data)=> {
        this.operationDetachementDroit = data.data
        let dateOperation = new Date(this.localStore.getData("currentSeance").dateFermeture);
        console.log(this.operationDetachementDroit)
        if(this.operationDetachementDroit===null){
          this.entityForm.patchValue({id:null})
          this.entityForm.get('detachement').patchValue({
              referenceAvis: '',
              qteAction: '0',
              qteDroit: '0',
              dateOperation: new NgbDate(
                dateOperation.getFullYear(), dateOperation.getMonth() + 1, dateOperation.getDate()),
              dateValeur:new NgbDate(
                dateOperation.getFullYear(), dateOperation.getMonth() + 1, dateOperation.getDate())
            }
          );
          this.afficherQuantiteReel()
          return;
        }
         dateOperation = new Date(this.operationDetachementDroit.dateOperation);
        let dateValeur = new Date(this.operationDetachementDroit.dateValeur);

        this.entityForm.get('detachement').patchValue({
            id:this.operationDetachementDroit.idAvis,
            referenceAvis: this.operationDetachementDroit.referencePiece,
            qteAction: this.operationDetachementDroit.qteAction,
            qteDroit: this.operationDetachementDroit.qteDroit,
            dateOperation: new NgbDate(
              dateOperation.getFullYear(), dateOperation.getMonth() + 1, dateOperation.getDate()),
            dateValeur: new NgbDate(
            dateValeur.getFullYear(), dateValeur.getMonth() + 1, dateValeur.getDate())
          }
        );
      })
  }
  titreChange(){
    this.idTitre=this.entityForm.value.titre.idTitre
    // this.symbolTitre=item.symbolTitre
    // // console.log(this.symbolTitre)
    this.titreService.getById(this.idTitre).subscribe(
      (data)=>{


      }
    )

  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
    this.idTitre=0
    this.entityForm.patchValue({id:null})
    this.entityForm.get('detachement').patchValue({
        referenceAvis: '',
        qteAction: '0',
        qteDroit: '0',
        dateOperation: null,
        dateValeur:null
      }
    );
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  onSaveEntity()
  {
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([this.router.url]);
    // });
    // window.location.reload()
    // return;
    // this.isLoading = true;
    // this.submitted = true;
    // if(this.entityForm.invalid) return;
    // const sb = this.saveEntity()
    //   .pipe(
    //     catchError((err) => {
    //       return of(undefined);
    //     }),
    //     finalize(() => {
    //       this.submitted = false;
    //       this.isLoading = false;
    //       this.router.navigate(['/opcvm/evenementsurvaleur/operationdetachement/liste']);
    //     })
    //   )
    //   .subscribe(
    //     (data)=> {
    //
    //     }
    //   );
    // this.subscriptions.push(sb);
  }

  saveEntity() {
    if(this.idTitre===0){
      alert('Veuillez choisir un titre')
      return;
    }
    console.log(this.entityForm.get('detachement.refenrenceAvis')?.value)
    if(this.entityForm.get('detachement.referenceAvis')?.value===null||
      this.entityForm.get('detachement.referenceAvis')?.value===undefined){
      alert('Veuillez saisir la référence avis')
      return;
    }
    if(this.entityForm.get('detachement.referenceAvis')?.value.toString().trim()===""){
      alert('Veuillez saisir la référence avis')
      return;
    }
    if(this.entityForm.get('detachement.dateOperation')?.value===null){
      alert('Veuillez choisir la date opération')
      return;
    }
    if(this.entityForm.get('detachement.dateOperation')?.value===null){
      alert('Veuillez choisir la date opération')
      return;
    }
    if(this.entityForm.get('detachement.dateValeur')?.value===null){
      alert('Veuillez choisir la référence valeur')
      return;
    }
    if(this.entityForm.get('detachement.qteAction')?.value===null ||
      this.entityForm.get('detachement.qteAction')?.value==="0"){
      alert('Veuillez saisir la quantité action')
      return;
    }
    if(this.entityForm.get('detachement.qteDroit')?.value===null ||
      this.entityForm.get('detachement.qteDroit')?.value==="0"){
      alert('Veuillez saisir la quantité droit')
      return;
    }

    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    let dateOperation: any;
    if(this.entityForm.get('detachement.dateOperation')?.value)
    {
      dateOperation = new Date(
        this.entityForm.get('detachement.dateOperation')?.value.year,
        this.entityForm.get('detachement.dateOperation')?.value.month-1,
        this.entityForm.get('detachement.dateOperation')?.value.day+1);
    }
    let dateSaisie=dateOperation;
    let dateValeur: any;
    if(this.entityForm.get('detachement.dateValeur')?.value)
    {
      dateValeur = new Date(
        this.entityForm.get('detachement.dateValeur')?.value.year,
        this.entityForm.get('detachement.dateValeur')?.value.month-1,
        this.entityForm.get('detachement.dateValeur')?.value.day+1);
    }
    let datePiece=dateOperation

    let qteAction=0
    if(this.entityForm.get('detachement.qteAction')?.value)
    {
      qteAction=this.entityForm.get('detachement.qteAction')?.value
    }
    let titre=new TitreModel();
    titre.idTitre=this.idTitre

    let qteDroit=0
    if(this.entityForm.get('detachement.qteDroit')?.value)
    {
      qteDroit=this.entityForm.get('detachement.qteDroit')?.value
    }

    let idOperation=0
   this.id=this.entityForm.value.id
    if(this.id)
      idOperation=this.id

    const entity: any = {
      ...this.entityForm.value,
      idSeance : this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance,
      idTransaction : 0,
      idOperation:idOperation,
      dateOperation :this.localStore.getData("currentSeance").dateFermeture,
      dateSaisie :dateSaisie,
      dateValeur :dateValeur,
      datePiece:datePiece,
      referencePiece:this.entityForm.get('detachement.referenceAvis')?.value,
      montant :0,
      ecriture:"A",
      estOD :false,
      type : "DD",
      titre:titre,
      libelleOperation:"Détachement droit",
      qteAction:qteAction,
      opcvm:this.opcvm,
      qteDroit:qteDroit,
      userLogin:this.authService.currentUserValue?.username
    };
    console.log("act1",entity)
    // return;
    return this.id
      ? this.entityService.modifier(entity).subscribe(
        (data)=>{
          window.location.reload();
        }
      )
      : this.entityService.create(entity).subscribe(
        (data)=>{
          window.location.reload()
        }
      );
  }
}
