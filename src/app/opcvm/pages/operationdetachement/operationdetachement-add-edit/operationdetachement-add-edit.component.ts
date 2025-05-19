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
  styleUrl: './operationdetachement-add-edit.component.scss'
})
export class OperationdetachementAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  detailProfil: Detailprofil;
  formule$: any;
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

    this.afficherIntervenant()
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.dateFermeture=this.localStore.getData("currentSeance")?.dateFermeture

    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de détachement'")
      const sb = this.entityService.getById(this.id)
        .subscribe((entity)=>{
          console.log("profil=",entity.data)
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de détachement")
  }
  afficherTitre(){
    this.loadingService.setLoading(true)
    let typeEVenement=this.entityForm.value.typeEvenement
    this.entityService.afficherTitre(this.localStore.getData("currentOpcvm")?.idOpcvm,
      this.localStore.getData("currentSeance")?.dateFermeture,typeEVenement).subscribe(
      (data)=>{
        this.titre$=data.data
        this.titre=data.data
        this.loadingService.setLoading(false)
      }
    )
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({codeProfil:
      entity.codeProfil});
    this.entityForm.patchValue({libelleProfil: entity.libelleProfil});
    this.entityForm.patchValue({id: entity.codeProfil});
    this.entityForm.patchValue({typeCommission: entity.typeCommission});
    this.entityForm.patchValue({standard: entity.standard});
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
    console.log("entityreel=",entity)
    this.formuleService.quantiteReel(entity).subscribe(
      (data)=>{
        // this.formule$=data.data
        console.log(data.data)
        this.entityForm.patchValue({qteDetenue:data.data})
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
        // this.entityForm.patchValue({dateReelle:dateEcheance})
      }
    )
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  typePayementChange(){
    if(!this.idTitre)
      return

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
      dateOperation = new Date(
        this.entityForm.controls.dateReelle.value.year,
        this.entityForm.controls.dateReelle.value.month-1,
        this.entityForm.controls.dateReelle.value.day+1);
    }
    let dateValeur: any;
    if(this.entityForm.controls.dateValeur.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateValeur.value.year,
        this.entityForm.controls.dateValeur.value.month-1,
        this.entityForm.controls.dateValeur.value.day+1);
    }

    let titre=new TitreModel()
    titre.idTitre=this.idTitre
    const entity={
      ...this.entityForm.value,
      titre:titre,
      dateOperation:dateOperation,
      dateValeur:dateValeur,
      dateReelle:dateReelle
    }
    this.entityService.valeurOuQte(entity).subscribe(
      (data)=>{
        let entity=data.data
        this.entityForm.patchValue({nominalRemb:entity.nominalRemb})
        this.entityForm.patchValue({couponDividendeUnitaire :entity.couponDividendeUnitaire})
        this.entityForm.patchValue({quantiteAmortie :entity.quantiteAmortie})

        this.bNominalRemb=entity.bNominalRemb
        this.bCoupDivUnit=entity.bCoupDivUnit
        this.bQtiteAMORT=entity.bQtiteAMORT
      }
    )
    let typePayement=this.entityForm.value.typePayement
    switch (typePayement)
    {
      case "CAPITAL + INTERET":
        //meb_qtiteAMORT.ReadOnly=false;
        this.bNominalRemb=false
        this.bCoupDivUnit=false

        this.capitalRemb();
        this.couponDivTotal();
        break;

      case "INTERET":
        this.bQtiteAMORT=true
        this.bNominalRemb=true
        this.bCoupDivUnit=false
        //meb_qtiteAMORT.Value = 0;
        this.entityForm.patchValue({nominalRemb:"0"})
        this.entityForm.patchValue({capitalRembourse:"0"})

        this.couponDivTotal();
        break;

      case "CAPITAL":
        //meb_qtiteAMORT.ReadOnly = false;
        this.bNominalRemb = false;
        this.bCoupDivUnit= true;
        this.entityForm.patchValue({couponDividendeUnitaire:"0"})
        this.entityForm.patchValue({couponDividendeTotal:"0"})

         this.capitalRemb();
        break;
    }
  }
  capitalRemb()
  {
    try
    {
      let qteDetenue:number=0;
      if(this.entityForm.controls.qteDetenue.value){
        qteDetenue=this.entityForm.value.qteDetenue
      }
      let nominalRemb:number=0;
      if(this.entityForm.controls.nominalRemb.value){
        nominalRemb=this.entityForm.value.nominalRemb
      }
      let quantiteAmortie:number=0;
      if(this.entityForm.controls.quantiteAmortie.value){
        quantiteAmortie=this.entityForm.value.quantiteAmortie
      }
      let codeTypeTitre:string="";
      if(this.entityForm.controls.codeTypeTitre.value){
        codeTypeTitre=this.entityForm.value.codeTypeTitre
      }
      codeTypeTitre=codeTypeTitre.trim().toUpperCase()
      if ( codeTypeTitre==="OBLIGATI"||
        codeTypeTitre==="OBLIGATN")
      {
        this.obligationService.getById(this.idTitre).subscribe(
          (data)=>{
            this.tcn$=data.data
            if(this.tcn$!==null){
              if (this.tcn$.modeAmortissement.libelleModeAmortissement === "SUR VALEUR")
              {
                this.entityForm.patchValue({capitalRembourse:(qteDetenue*nominalRemb).toString()})
              }
              else
              {
                this.entityForm.patchValue({capitalRembourse:(quantiteAmortie*nominalRemb).toString()})
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
            console.log(this.tcn$)
            if (this.tcn$.modeAmortissement.libelleModeAmortissement === "SUR VALEUR")
            {
              this.entityForm.patchValue({capitalRembourse:(qteDetenue*nominalRemb).toString()})
            }
            else
            {
              this.entityForm.patchValue({capitalRembourse:(quantiteAmortie*nominalRemb).toString()})
            }
          }
        )
      }
    }
    catch { }

  }

  couponDivTotal()
  {
    let qteDetenue:number=0;
    if(this.entityForm.controls.qteDetenue.value){
      qteDetenue=this.entityForm.value.qteDetenue
    }
    let couponDividendeUnitaire:number=0;
    if(this.entityForm.controls.couponDividendeUnitaire.value){
      couponDividendeUnitaire=this.entityForm.value.couponDividendeUnitaire
    }
    this.entityForm.patchValue({couponDividendeTotal:Math.round(qteDetenue*couponDividendeUnitaire).toString()})

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
    this.idTitre=item.idTitre
    // this.symbolTitre=item.symbolTitre
    // // console.log(this.symbolTitre)
    this.titreService.getById(item.idTitre).subscribe(
      (data)=>{
        this.titreSelonId=data.data
        this.entityForm.patchValue({designation:this.titreSelonId.designationTitre})
        this.entityForm.patchValue({codeTypeTitre:this.titreSelonId.typeTitre.codeTypeTitre})
      }
    )
    this.afficherQuantiteReel()
    this.afficherDerniereEcheance()
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
    this.tableau = document.getElementById("table_DetailProfil");
    let length = this.tableau.getElementsByTagName('tr').length
    if (length == 1) {
      alert("Veuillez ajouter le détails profil")
      return;
    }
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
          this.router.navigate(['/opcvm/standard/profilopc']);
        })
      )
      .subscribe(
        (data)=>{

          this.nbreLigne = document.getElementById("table_DetailProfil").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
          let i: number = 1;
          this.detailProfilService.supprimer(this.entityForm.value.codeProfil,
            this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe();
          //        console.log(this.nbreLigne);
          for (i === 1; i < this.nbreLigne; i++) {
            this.detailProfil=new Detailprofil();
            this.detailProfil.opcvm=new Opcvm();
            this.detailProfil.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
            this.detailProfil.codeProfil=this.entityForm.value.codeProfil;
            // @ts-ignore
            this.detailProfil.borneInferieur=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[0].innerHTML;
            // @ts-ignore
            this.detailProfil.borneSuperieur=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[1].innerHTML;
            // @ts-ignore
            this.detailProfil.montantMinimum=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[2].innerHTML;
            // @ts-ignore
            this.detailProfil.taux=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[3].innerHTML;
            console.log("detailProfil"+i,this.detailProfil)
            this.detailProfilService.create(this.detailProfil).subscribe();
          }
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    const entity: any = {
      codeProfil:this.entityForm.value.codeProfil,
      libelleProfil:this.entityForm.value.libelleProfil,
      typeCommission:this.entityForm.value.typeCommission,
      standard:this.entityForm.value.standard,
      opcvm:this.opcvm
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}
