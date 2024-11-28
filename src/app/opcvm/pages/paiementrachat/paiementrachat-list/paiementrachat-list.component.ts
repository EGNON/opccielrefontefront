import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Operationsouscriptionrachat2} from "../../../models/operationsouscriptionrachat2.model";
import {Natureoperation} from "../../../../core/models/natureoperation.model";
import {Config} from "datatables.net";
import {Opcvm} from "../../../../core/models/opcvm";
import {SweetAlertOptions} from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DepotrachatService} from "../../../services/depotrachat.service";
import {OperationsouscriptionrachatService} from "../../../services/operationsouscriptionrachat.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {LoaderService} from "../../../../loader.service";
import {LocalService} from "../../../../services/local.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbActiveModal, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OperationpaiementrachatService} from "../../../services/operationpaiementrachat.service";
import {FormuleService} from "../../../../core/services/formule.service";
import {ExerciceService} from "../../../services/exercice.service";

@Component({
  selector: 'app-paiementrachat-list',
  templateUrl: './paiementrachat-list.component.html',
  styleUrl: './paiementrachat-list.component.scss'
})
export class PaiementrachatListComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  nbreLigne:number;
  verifier:boolean;
  verifier_Bouton:boolean;
  operationSouscriptionRachatTab:Operationsouscriptionrachat2[];
  operationSouscriptionRachat:Operationsouscriptionrachat2;
  natureOperation:Natureoperation;
  datatableConfig: Config = {};
  submitted = false;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  operationPaiementRachat$:any;
  opcvm:Opcvm;
  personne$:any;
  exercice$:any;
  solde:any;
  depotRachat2$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  private clickListener: () => void;
  private idInAction: number;
  entityForm: FormGroup;

  // @ts-ignore
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: OperationpaiementrachatService,
    public formuleService: FormuleService,
    public exerciceService: ExerciceService,
    public operationSouscriptionRachatService:OperationsouscriptionrachatService,
    public personneService: PersonneService,
    public loadingService: LoaderService,
    public localStore: LocalService,
    public seanceOpcvmService: SeanceopcvmService,
    public authService: AuthService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private modalService: NgbModal) {
  }
  get f() {
    return this.entityForm.controls;
  }
  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        denominationOpcvm: [null],
        idSeance: [null],
        dateOuverture: [null],
        dateFermeture: [null],
        dateOperation: [null,Validators.required],
        solde: [null],
        totalMontantRachat: [null],
      }
    );

    // console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    // console.log("idOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
    this.afficherSoldeCompteFormule()
    this.seanceOpcvmService.afficherSeanceEnCours(this.localStore.getData("currentOpcvm").idOpcvm)
      .subscribe(val=> {
        //console.log("val=",val)
        this.seance=val.data;
        this.idSeance=val.data.idSeanceOpcvm.idSeance;
        this.entityForm.patchValue({denominationOpcvm:this.seance.opcvm?.denominationOpcvm})
        this.entityForm.patchValue({idSeance:this.seance.idSeanceOpcvm.idSeance})
        let dateOuverture = new Date(this.seance.dateOuverture);
        this.entityForm.patchValue({dateOuverture: new NgbDate(
            dateOuverture.getFullYear(), dateOuverture.getMonth()+1, dateOuverture.getDate())});

        let dateFermeture = new Date(this.seance.dateFermeture);
        this.entityForm.patchValue({dateFermeture: new NgbDate(
            dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});
      })
  }
  afficherSoldeCompteFormule(){
    let idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm
    this.exerciceService.afficherExerciceCourant(idOpcvm).subscribe(
      (data)=>{
        this.exercice$=data.data
        console.log(this.exercice$)
        const entity={
          idOpcvm:this.localStore.getData("currentOpcvm").idOpcvm,
          numCompte:"1231000",
          codeplan:this.exercice$.plan.codePlan.trim(),
          idTitre:null,
          date:this.localStore.getData("currentSeance").dateFermeture.substring(0,10)
        }
        this.formuleService.soldeCompteFormule(entity).subscribe(
          (data)=>{
              this.solde=data.data
            console.log("idOpcvm",this.localStore.getData("currentOpcvm").idOpcvm)
            console.log("plan",this.exercice$.plan.codePlan)
            console.log("dateFErmeture",this.localStore.getData("currentSeance").dateFermeture.substring(0,10))
            console.log("solde=",this.solde)
          }
        )
      }
    )

  }
  afficherPrecalculPaiementRachat(){
    this.loadingService.setLoading(true)
    this.entityService.precalculPaiementRachat(
      this.localStore.getData("currentOpcvm").idOpcvm,this.entityForm.value.idSeance).subscribe(
      (data)=>{
        this.operationPaiementRachat$=data.data
        //console.log(this.operationPaiementRachat$)
        let totalMontantRachat=0
        let i=0
        for(i==0;i<this.operationPaiementRachat$.length;i++){
          totalMontantRachat+=Number(this.operationPaiementRachat$[i].montant)
        }
        this.entityForm.patchValue({totalMontantRachat:totalMontantRachat})
      }
    )
    this.loadingService.setLoading(false)
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }


  enregistrer(){
    /* const entity={
       idOpcvm:this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm,
       codeNatureOperation:"INT_RACH",
       niveau:"1",
       userLoginVerif:this.authService.currentUserValue?.denomination
     }*/
    this.nbreLigne = document.getElementById("table_OperationSousRach").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    if(this.nbreLigne===1){
      alert("Aucune donnée dans la grille")
      return
    }
    this.loadingService.setLoading(true)
    this.submitted=true
    let i: number = 1;
    let dateOperation: any;

    if(this.entityForm.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.entityForm.controls.dateOperation.value.year,
        this.entityForm.controls.dateOperation.value.month-1,
        this.entityForm.controls.dateOperation.value.day+1);
    }
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm
    //        console.log(this.nbreLigne);
    this.operationSouscriptionRachatTab=[]
    for (i === 1; i < this.nbreLigne; i++) {
      this.operationSouscriptionRachat=new Operationsouscriptionrachat2();
      this.operationSouscriptionRachat.referencePiece = "";
      // @ts-ignore
      this.operationSouscriptionRachat.idActionnaire=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[0].innerHTML.trim())
      this.operationSouscriptionRachat.idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm
      this.operationSouscriptionRachat.idSeance=this.entityForm.value.idSeance
      this.operationSouscriptionRachat.idPersonne=this.entityForm.value.personne.idPersonne
      this.operationSouscriptionRachat.dateOperation =dateOperation;
      this.operationSouscriptionRachat.codeNatureOperation="RACH_PART"
      this.operationSouscriptionRachat.datePiece = dateOperation;
      this.operationSouscriptionRachat.dateSaisie =new Date();
      this.operationSouscriptionRachat.montantSousALiquider=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[18].innerHTML)
      this.operationSouscriptionRachat.sousRachatPart=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[19].innerHTML)
      this.operationSouscriptionRachat.commisiionSousRachat=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[5].innerHTML)
      this.operationSouscriptionRachat.tAFCommissionSousRachat=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[6].innerHTML)
      this.operationSouscriptionRachat.retrocessionSousRachat=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[7].innerHTML)
      this.operationSouscriptionRachat.tAFRetrocessionSousRachat=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[8].innerHTML)
      this.operationSouscriptionRachat.commissionSousRachatRetrocedee=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[9].innerHTML)
      this.operationSouscriptionRachat.modeValeurLiquidative=null
      this.operationSouscriptionRachat.coursVL=0
      this.operationSouscriptionRachat.regulResultatExoEnCours=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[16].innerHTML)
      this.operationSouscriptionRachat.regulSommeNonDistribuable=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[15].innerHTML)
      this.operationSouscriptionRachat.regulReportANouveau=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[10].innerHTML)
      this.operationSouscriptionRachat.regulautreResultatBeneficiaire=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[11].innerHTML)
      this.operationSouscriptionRachat.regulautreResultatDeficitaire=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[12].innerHTML)
      this.operationSouscriptionRachat.regulResultatEnInstanceBeneficiaire=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[13].innerHTML)
      this.operationSouscriptionRachat.regulResultatEnInstanceDeficitaire=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[14].innerHTML)
      this.operationSouscriptionRachat.regulExoDistribution=Number(document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[17].innerHTML)
      this.operationSouscriptionRachat.montantDepose=0
      this.operationSouscriptionRachat.montantConvertiEnPart=0
      this.operationSouscriptionRachat.nombrePartSousRachat=0
      this.operationSouscriptionRachat.dateValeur =dateOperation;
      this.operationSouscriptionRachat.ecriture = "A";
      this.operationSouscriptionRachat.estRetrocede = false;
      this.operationSouscriptionRachat.resteRembourse = false;
      this.operationSouscriptionRachat.rachatPaye = false;
      this.operationSouscriptionRachat.fraisSouscriptionRachat = 0;
      this.operationSouscriptionRachat.quantiteSouhaite = 0;
      this.operationSouscriptionRachat.reste = 0;
      this.operationSouscriptionRachat.idOperation = 0;
      this.operationSouscriptionRachat.idTransaction = 0;
      this.operationSouscriptionRachat.libelleOperation = "Rachat de " +
        document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[4].innerHTML + " Part(s)";
      this.operationSouscriptionRachat.valeurCodeAnalytique = "OPC:" + this.localStore.getData("currentOpcvm").idOpcvm +
        ";ACT:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[0].innerHTML.trim();
      this.operationSouscriptionRachat.valeurFormule = "10:" +
        document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[5].innerHTML +
        ";17:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[9].innerHTML +
        ";26:" + 0 +
        ";35:" + 0+
        ";36:" + 0 +
        ";41:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[18].innerHTML +
        ";43:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[4].innerHTML +
        ";59:" + 0 +
        ";60:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[11].innerHTML +
        ";61:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[12].innerHTML +
        ";62:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[17].innerHTML +
        ";63:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[10].innerHTML +
        ";64:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[13].innerHTML +
        ";65:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[14].innerHTML +
        ";66:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[16].innerHTML +
        ";67:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[15].innerHTML +
        ";72:" + 0 +
        ";74:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[7].innerHTML +
        ";80:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[19].innerHTML +
        ";123:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[6].innerHTML +
        ";84:" + document.getElementById("table_OperationSousRach").getElementsByTagName('tr')[i].cells[8].innerHTML;
      this.operationSouscriptionRachat.valeurFormule = this.operationSouscriptionRachat.valeurFormule.replace(',','.');
      this.operationSouscriptionRachat.userLogin =this.authService.currentUserValue?.denomination
      console.log("tab"+i,this.operationSouscriptionRachat)
      // @ts-ignore
      this.operationSouscriptionRachatTab.push(this.operationSouscriptionRachat);
    }
    this.operationSouscriptionRachatService.creer(this.operationSouscriptionRachatTab)
      .subscribe(
        {
          next: (value) => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
              this.submitted=false
            });
          },
          error: err => {

          }
        }
      )
    this.loadingService.setLoading(false)
  }
}


