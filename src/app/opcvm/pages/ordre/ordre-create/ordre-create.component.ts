import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Ordresignataire} from "../../../models/ordresignataire.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {OrdreService} from "../../../services/ordre.service";
import {OrdresignataireService} from "../../../services/ordresignataire.service";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {TitreService} from "../../../../titresciel/services/titre.service";
import {TypeordreService} from "../../../services/typeordre.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {Natureoperation} from "../../../../core/models/natureoperation.model";
import {Pays} from "../../../../crm/models/pays.model";
import {TitreModel} from "../../../../titresciel/models/titre.model";
import {PersonnePhysique} from "../../../../crm/models/personne/personne.physique.model";
import {LoaderService} from "../../../../loader.service";

@Component({
    selector: 'app-ordre-create',
    templateUrl: './ordre-create.component.html',
    styleUrl: './ordre-create.component.scss',
    standalone: false
})
export class OrdreCreateComponent implements OnInit, OnDestroy{
  id?: number;
  public titreSettings = {};
  public personnePhysiqueSettings = {};
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  titre$: any;
  typeOrdre$: any;
  personne: any;
  ordreSignataire: Ordresignataire;
  ordreSignataire$: any;
  personnePhysique$: any;
  personnePhysique: any;
  titreSelectionne: TitreModel[] = [];
  personnePhysiqueSelectionne: PersonnePhysique[] = [];
  titreSelonId: TitreModel;
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
  symbolTitre:any;
  quantiteLimite:any;
  titre: any;
  titreModel: TitreModel;
  idTitre:any;
  enabledCoursLimite:boolean;
  @Input() nb: number;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: OrdreService,
    public ordreSignataireService: OrdresignataireService,
    public detailProfilService: DetailprofilService,
    public personneService: PersonneService,
    public personnePhysiqueService: PersonnePhysiqueService,
    public titreService: TitreService,
    public typeOrdreService: TypeordreService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    public loadingService: LoaderService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        dateOrdre: [new Date(),Validators.required],
        personne: [null,Validators.required],
        signataire: [null,Validators.required],
        // souscription: [null],
        // achat: [null],
        // vente: [null],
        role: [null,Validators.required],
        titre: [null,Validators.required],
        // symboleTitre: [null],
        designation: [null],
        cotation: [null],
        depositaire: [null],
        typeOrdre: [null,Validators.required],
        accepterPerte: [false],
        quantiteLimite: [null],
        coursLimite: [null],
        dateLimite: [new Date(),Validators.required],
        montantBrut: [null],
        interet: [null],
        commissionPlace: [null],
        commissionDepositaire: [null],
        commissionSGI: [null],
        tAF: [null],
        plusOuMoinsValue: [null],
        iRVM: [null],
        montantNet: [null],
        commentaires: [null],
        statut: [null],
        checkSignataire: [null],
        // idPersonne0: [null],
        // idPersonne1: [null],
        // idPersonne2: [null],
        // idPersonne3: [null],
      }
    );
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
    this.personnePhysiqueSettings = {
      singleSelection: false,
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
    this.afficherIntervenant()
    // if(!this.id)
      this.afficherSignataire()

    this.afficherTitre()
    this.afficherTypeOrdre()
    this.idPersonneTab=[];

    this.quantiteLimite=0
    this.coursLimite=0
    this.entityForm.patchValue({statut:"NON ENVOYE"})
    this.entityForm.patchValue({montantBrut:"0"})
    this.entityForm.patchValue({interet:"0"})
    this.entityForm.patchValue({commissionPlace:"0"})
    this.entityForm.patchValue({commissionDepositaire:"0"})
    this.entityForm.patchValue({commissionSGI:"0"})
    this.entityForm.patchValue({tAF:"0"})
    this.entityForm.patchValue({plusOuMoinsValue:"0"})
    this.entityForm.patchValue({iRVM:"0"})
    this.entityForm.patchValue({montantNet:"0"})
    this.entityForm.patchValue({quantiteLimite:"0"})
    this.entityForm.patchValue({coursLimite:"0"})
    let date=new Date()
    this.entityForm.patchValue({dateOrdre: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});

    this.entityForm.patchValue({dateLimite: new NgbDate(
        date.getFullYear(), date.getMonth()+1, date.getDate())});

    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification ordre de bourse'")
      const sb = this.entityService.afficherSelonId(this.id)
        .subscribe((entity)=>{
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout d'ordre de bourse")
    this.addField()
    // console.log(this.localStore.getData("currentSeance"))
  }
  addField(): void {
    let i=0
    for(i===0;i<=100;i++)
    {
      // this.entityForm.addControl("idPersonne"+i, new FormControl('', Validators.required));
      this.entityForm.addControl("checkSignataire"+i, new FormControl(''));
    }

  }
  changeTypeOrdre(){
    // console.log(this.entityForm.value.typeOrdre.libelleTypeOrdre)
    if(this.entityForm.value.typeOrdre!=null){
      if(this.entityForm.value.typeOrdre.libelleTypeOrdre.trim()==="COURS LIMITE"){
        this.enabledCoursLimite=false
      }
      else
      {
        this.enabledCoursLimite=true
      }
      this.entityForm.patchValue({coursLimite:"0"})
      this.calculer()
    }
  }
  get titres(): FormArray { return <FormArray>this.entityForm.get('titre')}
  get signataires(): FormArray { return <FormArray>this.entityForm.get('signataire')}

  getPersonneSelected(index, idPersonne){

    this.tableau = document.getElementById('table_OrdreSignataire');
    // let formControlNamePersonne="idPersonne"+this.tableau.getElementsByTagName('tr')[index+1].cells[3].innerHTML
    let formControlNameCkeck="checkSignataire"+this.tableau.getElementsByTagName('tr')[index+1].cells[3].innerHTML.trim()
    // console.log(formControlNameCkeck)
    // return;
    let isSelected=false;
    isSelected=this.entityForm.get(formControlNameCkeck).value

    if(isSelected==true)
      this.idPersonneTab.push(idPersonne)
    else
    {
      let index=this.idPersonneTab.indexOf(idPersonne)
      if(index!==-1)
        this.idPersonneTab.splice(index,1)
    }
    console.log(this.idPersonneTab)
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    let dateOrdre = new Date(entity.dateOrdre);
    this.entityForm.patchValue({dateOrdre: new NgbDate(
        dateOrdre.getFullYear(), dateOrdre.getMonth()+1, dateOrdre.getDate())});

    let dateLimite = new Date(entity.dateLimite);
    this.entityForm.patchValue({dateLimite: new NgbDate(
        dateLimite.getFullYear(), dateLimite.getMonth()+1, dateLimite.getDate())});

    this.entityForm.patchValue({personne:
      entity.personne});
    this.entityForm.patchValue({statut: entity.statut});
    this.entityForm.patchValue({commentaires: entity.commentaires});
    // if(entity.role==="SOUSCRIPTION")
    //   this.entityForm.patchValue({souscription: true});
    // else
    //   if(entity.role==="RACHAT")
    //     this.entityForm.patchValue({rachat: true});
    //   else
    //     this.entityForm.patchValue({vente: true});

    this.entityForm.patchValue({id: entity.idOrdre});

    this.entityForm.patchValue({accepterPerte: entity.accepterPerte});
    // this.entityForm.patchValue({titre: entity.titre});
    if(entity.titre != null)
    {
      this.titreSelectionne=[];
      // for (let i = 0; i < entity.titre.length; i++) {
        this.titreSelectionne.push(entity.titre)
      // }
      console.log(this.titreSelectionne)
      this.titres.patchValue(this.titreSelectionne);
    }
    else
    {
      this.titreSelectionne=[];
      this.titres.patchValue(this.titreSelectionne);
    }
    this.idTitre=entity.titre.idTitre
    this.symbolTitre=entity.titre.symbolTitre
    console.log(this.symbolTitre)
    this.entityForm.patchValue({role: entity.role});
    this.entityForm.patchValue({typeOrdre: entity.typeOrdre});
    this.entityForm.patchValue({quantiteLimite: entity.quantiteLimite.toString()});
    this.quantiteLimite=entity.quantiteLimite
    this.entityForm.patchValue({coursLimite: entity.coursLimite.toString()});
    this.coursLimite=entity.coursLimite
    this.entityForm.patchValue({montantBrut: entity.montantBrut.toString()});
    this.entityForm.patchValue({interet: entity.interet.toString()});
    this.entityForm.patchValue({montantNet: entity.montantNet.toString()});
    this.entityForm.patchValue({plusOuMoinsValue: entity.plusOuMoinsValue.toString()});
    this.entityForm.patchValue({commissionPlace: entity.commissionPlace.toString()});
    this.entityForm.patchValue({commissionSGI: entity.commissionSGI.toString()});
    this.entityForm.patchValue({commissionDepositaire: entity.commissionDepositaire.toString()});
    this.entityForm.patchValue({tAF: entity.tAF.toString()});
    this.entityForm.patchValue({iRVM: entity.iRVM.toString()});
    // this.onItemSelect(entity.titre)
    this.titreService.getById(entity.titre.idTitre).subscribe(
      (data)=>{
        this.titreSelonId=data.data
        this.entityForm.patchValue({designation:this.titreSelonId.designationTitre})
        this.entityForm.patchValue({cotation:this.titreSelonId.libelleCotation})
        this.entityForm.patchValue({depositaire:this.titreSelonId.depositaire.sigle})
        // this.calculer()
      }
    )
    this.ordreSignataireService.afficherListeOrdreSignataire(entity.idOrdre).subscribe(
      (data)=>{
        this.ordreSignataire$=data.data;
        if(this.ordreSignataire$!= null)
        {
          this.personnePhysiqueSelectionne=[];
          for (let i = 0; i < this.ordreSignataire$.length; i++) {
             this.personnePhysiqueSelectionne.push(this.ordreSignataire$[i].personne)
             this.idPersonneTab.push(this.ordreSignataire$[i].personne.idPersonne)
          }
          console.log(this.personnePhysiqueSelectionne)
          this.signataires.patchValue(this.personnePhysiqueSelectionne);

        }
        else
        {
          this.personnePhysiqueSelectionne=[];
          this.signataires.patchValue(this.personnePhysiqueSelectionne);
        }

      }
    )


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  public onFilterChangeP(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownCloseP(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelectP(item: any) {

    // let isSelected=false;
    // isSelected=this.entityForm.get(formControlNameCkeck).value

      this.idPersonneTab.push(item.idPersonne)

      console.log(this.idPersonneTab)

  }
  public onDeSelectP(item: any) {
    let index=this.idPersonneTab.indexOf(item.idPersonne)
    if(index!==-1)
      this.idPersonneTab.splice(index,1)

    console.log(this.idPersonneTab)
  }

  public onSelectAllP(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAllP(items: any) {
    // console.log('onDeSelectAll', items);
  }
  onCoursKeyPress($event) {
    this.coursLimite=$event.target.value
    this.calculer()
  }
  onQuantiteKeyPress($event) {
    this.quantiteLimite=$event.target.value
    this.calculer()
  }
  calculer(){
    this.loadingService.setLoading(true)
    if(Number(this.coursLimite)===0 || Number(this.quantiteLimite===0)){
      this.entityForm.patchValue({montantBrut:"0"})
      this.entityForm.patchValue({interet:"0"})
      this.entityForm.patchValue({commissionPlace:"0"})
      this.entityForm.patchValue({commissionDepositaire:"0"})
      this.entityForm.patchValue({commissionSGI:"0"})
      this.entityForm.patchValue({tAF:"0"})
      this.entityForm.patchValue({plusOuMoinsValue:"0"})
      this.entityForm.patchValue({iRVM:"0"})
      this.entityForm.patchValue({montantNet:"0"})
      this.loadingService.setLoading(false)
      return
    }
    let dateOrdre: any;
    if(this.entityForm.controls.dateOrdre.value)
    {
      dateOrdre = new Date(
        this.entityForm.controls.dateOrdre.value.year,
        this.entityForm.controls.dateOrdre.value.month-1,
        this.entityForm.controls.dateOrdre.value.day+1);
    }
    let dateLimite: any;
    if(this.entityForm.controls.dateLimite.value)
    {
      dateLimite = new Date(
        this.entityForm.controls.dateLimite.value.year,
        this.entityForm.controls.dateLimite.value.month-1,
        this.entityForm.controls.dateLimite.value.day+1);
    }
    this.titreModel=new TitreModel()
    this.titreModel.idTitre=this.idTitre
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    const entity={
      ...this.entityForm.value,
      coursLimite:Number(this.coursLimite),
      quantiteLimite:Number(this.quantiteLimite),
      dateOrdre:dateOrdre,
      dateLimite:dateLimite,
      titre:this.titreModel,
      opcvm:this.opcvm
    }
    console.log("entity=",entity)
    this.entityService.calculer(entity).subscribe(
      (data)=>{
        this.ordreDto$=data.data
        console.log(this.ordreDto$)
        this.entityForm.patchValue({montantBrut:this.ordreDto$.montantBrut.toString()})
        this.entityForm.patchValue({montantNet:this.ordreDto$.montantNet.toString()})
        this.entityForm.patchValue({plusOuMoinsValue:this.ordreDto$.plusOuMoinsValue.toString()})
        this.entityForm.patchValue({iRVM:this.ordreDto$.iRVM.toString()})
        this.entityForm.patchValue({commissionPlace:this.ordreDto$.commissionPlace.toString()})
        this.entityForm.patchValue({commissionSGI:this.ordreDto$.commissionSGI.toString()})
        this.entityForm.patchValue({commissionDepositaire:this.ordreDto$.commissionDepositaire.toString()})
        this.entityForm.patchValue({interet:this.ordreDto$.interet.toString()})
        this.entityForm.patchValue({tAF:this.ordreDto$.tAF.toString()})
        this.loadingService.setLoading(false)

      }
    )

  }
  afficherSignataire(){
    this.personnePhysiqueService.afficherPersonnePhysiqueSelonQualite("SIGNATAIRES").subscribe(
      (data)=>{
        this.personnePhysique$=data
        this.personnePhysique=data
      }
    )
  }
  afficherTitre(){
    this.titreService.afficherTous().subscribe(
      (data)=>{
        this.titre$=data.data
        this.titre=data.data
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
    this.idTitre=item.idTitre
    this.symbolTitre=item.symbolTitre
    console.log(this.symbolTitre)
    this.titreService.getById(item.idTitre).subscribe(
      (data)=>{
        console.log(data.data)
        this.titreSelonId=data.data
        this.entityForm.patchValue({designation:this.titreSelonId.designationTitre})
        this.entityForm.patchValue({cotation:this.titreSelonId.libelleCotation})
        this.entityForm.patchValue({depositaire:this.titreSelonId.depositaire.sigle})
        this.calculer()
      }
    )

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
  afficherTypeOrdre(){
    this.typeOrdreService.afficherListe().subscribe(
      (data)=>{
        this.typeOrdre$=data.data
      }
    )
  }
  changeTitre(){
    // this.entityForm.patchValue({designation:this.entityForm.value.titre.designationTitre})
    // this.entityForm.patchValue({depositaire:this.entityForm.value.titre.depositaire.denomination})
    // this.entityForm.patchValue({cotation:this.entityForm.value.titre.cotation})
    // this.entityForm.patchValue({place:this.entityForm.value.place.libellePlace})
  }
  get f() { return this.entityForm.controls; }
  // addRow(id: string) {
  //   // @ts-ignore
  //   this.tableau = document.getElementById(id);
  //   var nbreLigne = this.tableau.getElementsByTagName('tr').length
  //   var ajouter = true;
  //
  //   // if(nbreLigne==0){
  //   //   ajouter=true;
  //   // }
  //   // for (let i = 1; i < nbreLigne; i++) {
  //   //   if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML===this.personne.idPersonne.toString()) {
  //   //     ajouter = false;
  //   //   }
  //   // }
  //   if (ajouter) {
  //     var tr = document.createElement('tr'); //On créé une ligne
  //     var td = document.createElement('td');
  //     tr.appendChild(td);
  //     td.innerHTML = this.entityForm.value.borneInferieur
  //     // @ts-ignore
  //     if (this.tableau.firstChild.tagName == 'TBODY') {
  //       // @ts-ignore
  //       this.tableau.firstChild.appendChild(tr);
  //     } else {
  //       this.tableau.appendChild(tr);
  //     }
  //     // td.hidden = true;
  //     var td = document.createElement('td');
  //     tr.appendChild(td);
  //     td.innerHTML = this.entityForm.value.borneSuperieur;
  //     // @ts-ignore
  //     if (this.tableau.firstChild.tagName == 'TBODY') {
  //       // @ts-ignore
  //       this.tableau.firstChild.appendChild(tr);
  //     } else {
  //       this.tableau.appendChild(tr);
  //     }
  //
  //     var td = document.createElement('td');
  //     tr.appendChild(td);
  //     td.innerHTML = this.entityForm.value.montantMinimum;
  //     // @ts-ignore
  //     if (this.tableau.firstChild.tagName == 'TBODY') {
  //       // @ts-ignore
  //       this.tableau.firstChild.appendChild(tr);
  //     } else {
  //       this.tableau.appendChild(tr);
  //     }
  //
  //     var td = document.createElement('td');
  //     tr.appendChild(td);
  //     td.innerHTML = this.entityForm.value.taux;
  //     // @ts-ignore
  //     if (this.tableau.firstChild.tagName == 'TBODY') {
  //       // @ts-ignore
  //       this.tableau.firstChild.appendChild(tr);
  //     } else {
  //       this.tableau.appendChild(tr);
  //     }
  //
  //     var buttonElement = document.createElement('button');
  //     // buttonElement.className="buttonSupprimer";
  //     buttonElement.style.alignContent = "center";
  //     buttonElement.style.borderStyle = "none";
  //     buttonElement.style.marginTop = "5 px";
  //     // @ts-ignore
  //     // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
  //     var _this = this;
  //     buttonElement.addEventListener("click", function (evt) {
  //       return _this.removeLine(tr.rowIndex);
  //     });
  //     // buttonElement.onclick=this.removeLine(tr.rowIndex);
  //     tr.appendChild(buttonElement);
  //     buttonElement.innerHTML = "X";
  //
  //     // @ts-ignore
  //     if (this.tableau.firstChild.tagName == 'TBODY') {
  //       // @ts-ignore
  //       this.tableau.firstChild.appendChild(tr);
  //     } else {
  //       this.tableau.appendChild(tr);
  //     }
  //   }
  // }
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
    // this.tableau = document.getElementById("table_OrdreSignataire");
    // let length = this.tableau.getElementsByTagName('tr').length
    let length = this.idPersonneTab.length
    if(this.id && length===0){
      console.log(this.entityForm.value.signataire)
      return
    }
    if (length ===0) {

      alert("Veuillez cocher le ou les signataires")
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
          this.router.navigate(['/opcvm/ordre/liste']);
        })
      )
      .subscribe(
        (data)=>{

          // this.nbreLigne = document.getElementById("table_OrdreSignataire").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
          // let i: number = 1;
          if(this.id)
          {
            this.ordreSignataireService.supprimer(this.id).subscribe();
            this.ordreSignataireService.Enregistrer(this.id,this.idPersonneTab).subscribe(
            )
          }
          else
            this.ordreSignataireService.Enregistrer(data.data,this.idPersonneTab).subscribe()

          // for (i === 1; i < this.nbreLigne; i++) {
          //   this.ordreSignataire=new Ordresignataire();
          //   this.ordreSignataire.ordre=new Ordre();
          //   this.ordreSignataire.ordre.idOrdre=data.data
          //
          //   this.ordreSignataire.personne=new Personne();
          //   // @ts-ignore
          //   this.ordreSignataire.personne.idPersonne=document.getElementById("table_OrdreSignataire").getElementsByTagName('tr')[i].cells[0].innerHTML;
          //   console.log("detailProfil"+i,this.ordreSignataire)
          //   this.detailProfilService.create(this.ordreSignataire).subscribe();
          // }
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
    let dateEnvoi=new Date("2050-12-31");
    let idIntervenant=this.entityForm.value.personne.idPersonne
    let role=this.entityForm.value.role.trim()
    let codeNatureOperation="";
    let libelleOperation="";

    this.titreModel=new TitreModel()
    this.titreModel.idTitre=this.idTitre

    if (role === "ACHAT")
    {
      codeNatureOperation = "ORDRE_ACH";
      libelleOperation = "ORDRE D'ACHAT DE " + this.entityForm.value.quantiteLimite +
        " " + this.symbolTitre;
    }
    else if (role === "VENTE")
    {
      codeNatureOperation = "ORDRE_VTE";
      libelleOperation = "ORDRE DE VENTE DE " +this.entityForm.value.quantiteLimite +
        " " + this.symbolTitre;
    }
    else
    {
      codeNatureOperation = "ORDRE_SOUS";
      libelleOperation = "ORDRE DE SOUSCRIPTION A " + this.entityForm.value.quantiteLimite +
        " " + this.symbolTitre;
    }
    let valeurFormule = "5:" + this.entityForm.value.montantBrut.replace(',', '.') +
      ";50:" + this.entityForm.value.quantiteLimite.replace(',', '.');
    let valeurCodeAnalytique = "OPC:" + this.localStore.getData("currentOpcvm")?.idOpcvm +
      ";TIT:" + this.idTitre;

    let natureOperation = new Natureoperation();
    natureOperation.codeNatureOperation=codeNatureOperation

    let dateOrdre: any;
    if(this.entityForm.controls.dateOrdre.value)
    {
      dateOrdre = new Date(
        this.entityForm.controls.dateOrdre.value.year,
        this.entityForm.controls.dateOrdre.value.month-1,
        this.entityForm.controls.dateOrdre.value.day+1);
    }
    let dateLimite: any;
    if(this.entityForm.controls.dateLimite.value)
    {
      dateLimite = new Date(
        this.entityForm.controls.dateLimite.value.year,
        this.entityForm.controls.dateLimite.value.month-1,
        this.entityForm.controls.dateLimite.value.day+1);
    }
    let commentaires: any;
    if(this.entityForm.controls.commentaires.value)
    {
      commentaires=this.entityForm.controls.commentaires.value
    }
    else
      commentaires=""

    let idOrdre=0
    if(this.id){
      idOrdre=this.id
    }
    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm,
      idOrdre:Number(idOrdre),
      titre:this.titreModel,
      idIntervenant:idIntervenant,
      dateEnvoi:dateEnvoi,
      quantiteExecute:0,
      montantNet:Number(this.entityForm.value.montantNet),
      commissionPlace:Number(this.entityForm.value.commissionPlace),
      commissionSGI:Number(this.entityForm.value.commissionSGI),
      commissionDepositaire:Number(this.entityForm.value.commissionDepositaire),
      iRVM:Number(this.entityForm.value.iRVM),
      tAF:Number(this.entityForm.value.tAF),
      interet:Number(this.entityForm.value.interet),
      coursLimite:Number(this.entityForm.value.coursLimite),
      quantiteLimite:Number(this.entityForm.value.quantiteLimite),
      montantBrut:Number(this.entityForm.value.montantBrut),
      plusOuMoinsValue:Number(this.entityForm.value.plusOuMoinsValue),
      natureOperation:natureOperation,
      valeurFormule:valeurFormule,
      valeurCodeAnalytique:valeurCodeAnalytique,
      idSeance:this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance,
      dateOrdre:dateOrdre,
      dateLimite:dateLimite,
      libelleOperation:libelleOperation,
      userLogin:this.authService.currentUserValue?.username,
      commentaires:commentaires,
      estEnvoye:false
    };

    console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(entity)
      : this.entityService.create(entity);
  }
}
