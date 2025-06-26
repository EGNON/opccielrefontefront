import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Detailmodele} from "../../../../core/models/detailmodele.model";
import {SweetAlertOptions} from "sweetalert2";
import {Observable, of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModeleecriturenatureoperationService} from "../../../../core/services/modeleecriturenatureoperation.service";
import {FormuleService} from "../../../../core/services/formule.service";
import {ModeleecritureformuleService} from "../../../../core/services/modeleecritureformule.service";
import {ModeleecritureService} from "../../../../core/services/modeleecriture.service";
import {ComptecomptableService} from "../../../../core/services/comptecomptable.service";
import {TypeoperationService} from "../../../../core/services/typeoperation.service";
import {TypetitreService} from "../../../../core/services/typetitre.service";
import {DetailmodeleService} from "../../../../core/services/detailmodele.service";
import {NatureoperationService} from "../../../../core/services/natureoperation.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first, map} from "rxjs/operators";
import {Formule} from "../../../../core/models/formule";
import {OperationService} from "../../../services/operation.service";
import {TitreService} from "../../../../titresciel/services/titre.service";
import {BanqueService} from "../../../../core/services/banque.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {LocalService} from "../../../../services/local.service";
import {Opcvm} from "../../../../core/models/opcvm";
import {AuthService} from "../../../../core/modules/auth";

@Component({
  selector: 'app-ecriture-manuel',
  templateUrl: './ecriture-manuel.component.html',
  styleUrl: './ecriture-manuel.component.scss'
})
export class EcritureManuelComponent implements OnInit, OnDestroy {
  id?: any;
  id2?: any;
  id3?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  formule:any;
  idFormule:number;
  entityForm: FormGroup;
  detailModele:Detailmodele;
  detailModele$: Observable<any[]>;
  // detailModeleTab:Detailmodele[];
  modeleEcriture:any;
  codeTypeOperation:string;
  codeModeleEcriture:string;
  modeleEcriture$:any;
  dateAlerte:Date;
  idTitre:any;
  idPersonne:any;
  compteComptable$:any;
  compteComptableSelect:any;
  numCompteComptable:any;
  tableau:HTMLElement;
  Formule$:any;
  banques$:any;
  titre$:any;
  titre:any;
  data$:any;
  libelleCompteComptable:any;
  typeTitre$:any;
  natureOperation$:any;
  typeOperation$:any;
  personne$:any;
  message:string;
  nbreLigne: number;
  idOpcvm: any;
  actionnaire: boolean;
  banque: boolean;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  // columnTotals: number[] = [0, 0];
  columns = [3,4];
  data:number[][]=[[]];
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  detailModeleTab: any[] = [];         // utilisé dans le HTML
  columnTotals = { debit: 0, credit: 0 };
  rowDetail = {idFormule:0, debit: 0, credit: 0 };
  public titreSettings = {};
  public personneSettings = {};
  type:any;
  @Input() entity: any;
  @Input() compteComptable2: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @ViewChild('debitInput') debitElement!: ElementRef;
  @ViewChild('creditInput') creditElement!: ElementRef;
  constructor(
    public modal: NgbActiveModal,
    private entityService: OperationService,
    private localStore: LocalService,
    private formuleService: FormuleService,
    private modeleEcritureFormuleService: ModeleecritureformuleService,
    private modeleEcritureService: ModeleecritureService,
    private compteComptableService: ComptecomptableService,
    private typeOperationService: TypeoperationService,
    private typeTitreService: TypetitreService,
    private personneService: PersonneService,
    private titreService: TitreService,
    private banqueService: BanqueService,
    private detailModeleService: DetailmodeleService,
    private natureOperationService: NatureoperationService,
    private cryptageService: CryptageService,
    private pageInfo: PageInfoService,
    public authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
  }
  onFocusInput(index: number, type: string) {
    this.type= type;
  }
  updateTotal() {
    let totalDebit = 0;
    let totalCredit = 0;
    for (let ligne of this.lignes.value) {
      totalDebit += Number(ligne.debit || 0);
      totalCredit += Number(ligne.credit || 0);
    }
    this.columnTotals.debit = totalDebit;
    this.columnTotals.credit = totalCredit;
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    this.idTitre=item.idTitre
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
    this.idTitre=0
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  public onFilterChangeA(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownCloseA(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelectA(item: any) {
    this.idPersonne=item.idPersonne
    // console.log('onItemSelect', item);
  }
  public onDeSelectA(item: any) {
    // console.log('onDeSelect', item);
    this.idPersonne=0
  }

  public onSelectAllA(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAllA(items: any) {
    // console.log('onDeSelectAll', items);
  }
  afficherTitre(){
    let code=this.entityForm.value.typeTitre.codeTypeTitre
    this.titreService.afficherSelonTypeTitre(code).subscribe(
      (data)=>{
        this.titre$=data.data
        this.titre=data.data
      }
    )
  }
  afficherBanque(){
    // let code=this.entityForm.value.typeTitre.codeTypeTitre
    this.banqueService.afficherTous().subscribe(
      (data)=>{
        this.banques$=data.data
        // this.titre=data.data
      }
    )
  }
  ngOnInit(): void {
    this.dateAlerte = new Date();

    // this.id = this.route.snapshot.params['id'];
    // this.id2 = this.route.snapshot.params['id2'];
    // this.id3 = this.route.snapshot.params['id3'];
    this.entityForm = this.fb.group(
      {
        id: [null],
        modeleEcriture: [null, Validators.required],
        compteComptable: [null],
        typeTitre: [null, Validators.required],
        typeOperation: [null, Validators.required],
        natureOperation: [null, Validators.required],
        libelleOperation: [null, Validators.required],
        formule: [null],
        montant: [null, Validators.required],
        banque: [null],
        actionnaire: [null],
        titre: [null],
        lignes: this.fb.array([])
      }
    );
    this.data=[[]]
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.actionnaire=false
    this.banque=true
    this.idPersonne=0
    this.idTitre=0
    // this.afficherCompteComptable()
    this.afficherTypeOperation()
    this.afficherTypeTitre()
    this.afficherModeleEcriture()
    this.afficherBanque()
    this.afficherPersonne()
    this.titreSettings = {
      singleSelection: true,
      idField: 'idTitre',
      textField: 'symbolTitre',
      enableCheckAll: true,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.personneSettings = {
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
      itemsShowLimit: 10,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    // this.afficherCategorie();
    // if (this.id) {
    //   console.log(this.id)
    //   this.pageInfo.updateTitle("Modification de Modèle écriture")
    //   const sb = this.entityService.afficherSelonId(this.id,this.id2,this.id3)
    //     .pipe(first())
    //     .subscribe((entity) =>
    //     {
    //       console.log(entity.data)
    //       this.loadFormValues(entity.data)
    //     });
    //   this.subscriptions.push(sb);
    // }
    // else {
      this.pageInfo.updateTitle("Saisie des écritures manuelles")
    // }
  }
  afficherPersonne(){
    this.personneService.afficherPersonneInOpcvmEtStatutCompte(this.idOpcvm).subscribe(
      (data)=>{
        this.personne$=data
      }
    )
  }
  get titres(): FormArray { return <FormArray>this.entityForm.get('titre')}

  loadValuesSelonModeleEcriture(){
    this.codeModeleEcriture=this.entityForm.value.modeleEcriture.codeModeleEcriture
    this.detailModele$=this.detailModeleService.afficherSelonModeleEcritureParProjection(this.codeModeleEcriture)
      .pipe(map(res => res.data));

        this.detailModele$.subscribe(data => {
          console.log(data)
          const lignesForm = data.map(item =>
            this.fb.group({
              idFormule: [item.idFormule],
              numCompteComptable: [item.numCompteComptable],
              libelleCompteComptable: [item.libelleCompteComptable],
              debit: [item.debit || 0, Validators.min(0)],
              credit: [item.credit || 0, Validators.min(0)],
              libelleFormule: [item.libelleFormule],
              type: [item.type],
              sensMvt: [item.sensMvt]
            })
          );
          this.lignes.clear();
          lignesForm.forEach(ctrl => this.lignes.push(ctrl));
          this.updateTotal();
        })
        this.lignes.valueChanges.subscribe(() => this.updateTotal());
        this.actionnaire=false
        this.banque=true
        this.entityService.afficherActionnaireBanque(this.idOpcvm,this.codeModeleEcriture).subscribe(
          (data)=>{
            this.actionnaire=data.data.actionnaire
            this.banque=data.data.banque
          }
        )
      // });
  }
  afficherLibelleCompteComptable(num:any){
    this.compteComptableService.afficherSelonNumCompteComptable(num)
      .subscribe(
      (data)=>{
       this.libelleCompteComptable= data.data.libelleCompteComptable;
        // td_type.innerHTML = data.data.type;
        // console.log("num("+num+")==",data.data.libelleCompteComptable)
      }
    )
  }
  get lignes(): FormArray {
    return this.entityForm.get('lignes') as FormArray;
  }
  allowOnlyNumbers(event: KeyboardEvent,index:number) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
      // return
     }
    // const isFocusedDebit = document.activeElement === this.debitElement.nativeElement;
    // const isFocusedCredit = document.activeElement === this.creditElement.nativeElement;

    // console.log(index,this.lignes.value[index].sensMvt)
    if(this.lignes.value[index].sensMvt==="C" &&  Number(charCode)!==0 && this.type==="debit")
    {
      console.log("pass")
      event.preventDefault();
    }


    if(this.lignes.value[index].sensMvt==="D" && Number(charCode)!==0 &&  this.type==="credit")
    {
      console.log("passons")
      event.preventDefault();
    }


    // this.data[index].push($event.target.value)
    // // this.columnTotals = this.columns.map((_, colIndex) =>
    // //   this.data.reduce((sum, row) => sum + (Number(row[colIndex]) || 0), 0)
    // // );
    // console.log(this.columnTotals)
  }
  afficherNatureOperation(){
    this.codeTypeOperation=this.entityForm.value.typeOperation.codeTypeOperation;
    this.natureOperationService.afficherSelonTypeOperation(this.codeTypeOperation).subscribe(
      (data)=>{
        this.natureOperation$=data.data;
      }
    )
  }
  afficherTypeTitre(){
    this.typeTitreService.afficherTous().subscribe(
      (data)=>{
        this.typeTitre$=data.data;
      }
    )
  }
  afficherTypeOperation(){
    this.typeOperationService.afficherTous().subscribe(
      (data)=>{
        this.typeOperation$=data.data;
      }
    )
  }
  afficherModeleEcriture(){
    this.modeleEcritureService.afficherTous().subscribe(
      (data)=>{
        this.modeleEcriture$=data.data;
        // console.log(this.modeleEcriture$)
      }
    )
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.entityForm.controls;
  }
  onSaveEntity() {
    // @ts-ignore
    this.nbreLigne = document.getElementById("table_Compte").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    let i: number = 1;
    //        console.log(this.nbreLigne);
    this.detailModeleTab=[]
    for (i === 1; i < this.nbreLigne; i++) {
      this.detailModele = new Detailmodele();
      this.detailModele.modeleEcriture = this.entityForm.value.modeleEcriture;
      // @ts-ignore
      if(document.getElementById("table_Compte").getElementsByTagName('tr')[i].cells[1].innerHTML!="") {// @ts-ignore
        this.detailModele.numCompteComptable = document.getElementById("table_Compte").getElementsByTagName('tr')[i].cells[1].innerHTML;
      }
      else
      {
        // @ts-ignore
        this.detailModele.numCompteComptable = document.getElementById("table_Compte").getElementsByTagName('tr')[i].cells[2].innerHTML;
      }
      this.detailModele.formule=new Formule();
      // @ts-ignore
      this.detailModele.formule.idFormule = document.getElementById("table_Compte").getElementsByTagName('tr')[i].cells[0].innerHTML;
      // @ts-ignore
      this.detailModele.sensMvt = document.getElementById("table_Compte").getElementsByTagName('tr')[i].cells[6].innerHTML;
      this.detailModele.numeroOrdre = i;
      // console.log("details modele"+i+"==",this.detailModele)
      //this.detailModeleService.create(this.detailModele).subscribe();
      this.detailModeleTab.push(this.detailModele);
    }

    // const sb = this.saveEntity().pipe(
    //   catchError((err) => {
    //     this.modal.dismiss(err);
    //     return of(undefined);
    //   }),
    //   finalize(() => {
    //     this.isLoading = false;
    //     if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/modeleecriture']);
    //   })
    // )
    //   .subscribe(
    //     (data)=> {
    //       this.modeleEcriture=data?.data;
    //       console.log(this.modeleEcriture)
    //       console.log("detailModeleTab",this.detailModeleTab)
    //       this.detailModeleService.enregistrer(this.detailModeleTab).subscribe()
    //     }
    //   );
    // this.subscriptions.push(sb);
  }

  saveEntity() {
    let opcvm=new Opcvm();
    opcvm.idOpcvm=this.idOpcvm
    let montant:number=this.entityForm.value.montant
    if(this.columnTotals.credit!==this.columnTotals.debit)
    {
      alert('Le total crédit doit être égal au montant débit')
      return;
    }
    if(Number(montant)!==this.columnTotals.debit)
    {
      alert('le montant de l\'opération doit etre égale à celui des écritures ')
      return;
    }
    let codeNatureOperation =this.entityForm.value.natureOperation.codeNatureOperation;
    let dateOperation =new Date(this.localStore.getData("currentSeance").dateFermeture);
    let datePiece = dateOperation;
    let dateSaisie = new Date();
    let dateValeur = dateOperation;
    let idOperation = 0;
    let idSeance = this.localStore.getData("currentSeance").idSeanceOpcvm?.idSeance;
    let idTransaction = 0;
    // let montant =this.entityForm.value.montant
    let referencePiece = "";
    let valeurCodeAnalytique=""

    valeurCodeAnalytique = "OPC:" + this.idOpcvm.toString();

    // if (ddl_CompteBancaire.Text != "")
    // {
    //   if (ddl_CompteBancaire.Text.Trim() == "COMPTE COURANT DEPOSITAIRE")
    //   {
    //     obj.ValeurCodeAnalytique = "OPC:" + obj.IdOpcvm.ToString();
    //   }
    //   else
    //   {
    //     obj.ValeurCodeAnalytique = "BQE:" + (((LGO.Business.Parametre.CompteBancaire)bds_CompteBancaire.Current).NumLigne).ToString();
    //   }
    // }
    let idActionnaire=0
    if(this.idPersonne!==0)
    {
      valeurCodeAnalytique += ";ACT:"+ this.idPersonne;
      idActionnaire = this.idPersonne;
    }
    let idTitre=0
    if(this.idTitre!==0)
    {
      valeurCodeAnalytique += ";TIT:"+ this.idTitre;
     idTitre = this.idTitre;
    }
    let totalDebit=0
    let totalCredit=0
    let valeurFormule="";
    for (let ligne of this.lignes.value) {
      // totalDebit += Number(ligne.debit || 0);
      // totalCredit += Number(ligne.credit || 0);
      // @ts-ignore
      // console.log(ligne)
      // @ts-ignore
      valeurFormule += ligne.idFormule.toString() + ":" + (Number(ligne.debit) === 0 ? ligne.credit : ligne.debit) + ";";

    }
    // this.columnTotals.debit = totalDebit;
    // this.columnTotals.credit = totalCredit;


    const entity = {
      ...this.entityForm.value,
      idActionnaire :idActionnaire,
      idTitre :idTitre,
      opcvm :opcvm,
      codeNatureOperation :codeNatureOperation,
      dateOperation :dateOperation,
      datePiece:datePiece,
      dateSaisie:dateSaisie,
      dateValeur :dateValeur,
      idOperation :0,
      idSeance :idSeance,
      idTransaction:0,
      referencePiece :"",
      type:"",
      valeurCodeAnalytique:valeurCodeAnalytique,
      valeurFormule:valeurFormule,
      userLogin:this.authService.currentUserValue?.username
    };
    console.log(entity)

    this.entityService.creerTout(entity).subscribe(
      (data)=>{
        alert('L\'écriture a été passée avec succès')
      }
    )
    // this.detailModeleService.supprimerSelonModeleEcriture
    // (this.entityForm.value.modeleEcriture.codeModeleEcriture.trim()).subscribe(
    //   (data)=>{
    //     // console.log("delete==",data)
    //   }
    // );
    // return this.id
    //   ? this.entityService.update(entity)
    //   : this.entityService.create(entity);
  }
}


