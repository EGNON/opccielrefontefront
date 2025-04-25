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
import {Operationpaiementrachat2} from "../../../models/operationpaiementrachat2.model";
import {MiseenaffectationService} from "../../../services/miseenaffectation.service";

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
  exerciceEnCours:boolean;
  verifier_Bouton:boolean;
  operationPaiementRachatTab:Operationpaiementrachat2[];
  operationPaiementRachat:Operationpaiementrachat2;
  natureOperation:Natureoperation;
  datatableConfig: Config = {};
  submitted = false;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  operationPaiementRachat$:any;
  opcvm:Opcvm;
  personne$:any;
  exercice$:any;
  save:boolean;
  solde:any;
  depotRachat2$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  estEnAttente:boolean;
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
    public miseEnAffectationService: MiseenaffectationService,
    public operationpaiementrachatService:OperationpaiementrachatService,
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
    this.loadingService.setLoading(false);
    // console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    // console.log("idOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
    this.afficherSoldeCompteFormule()
    this.verificationMiseAffectationEnAttente()


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

        this.entityForm.patchValue({dateOperation: new NgbDate(
            dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});
      })
    this.save=false
    //console.log(this.localStore.getData("currentSeance"))
    this.operationpaiementrachatService.liste(this.localStore.getData("currentOpcvm").idOpcvm,
      this.localStore.getData("currentSeance").idSeanceOpcvm.idSeance).subscribe(
      (data)=>{
          this.operationPaiementRachat$=data.data
          if(this.operationPaiementRachat$.length!==0 )
          {
            let i=0
            // for(i===0;i<this.operationPaiementRachat$.length;i++)
            // {
              if(this.operationPaiementRachat$[0].idOperation==0){
                this.save=false
              }
              else
                this.save=true
            // }

          }
          //console.log(this.save)
      }
    )
  }
  verifierPaiementRachat()
  {
    let jour="0"
    let mois="0"
    let annee="0"
    jour=this.entityForm.controls.dateOuverture.value.day
    mois=this.entityForm.controls.dateOuverture.value.month
    annee=this.entityForm.controls.dateOuverture.value.year

    if(Number(jour)<10)
    {
      jour="0"+jour
    }
    if(Number(mois)<10)
    {
      mois="0"+mois
    }

    let dateOuv=jour+"-"+
      (mois)+"-"+annee

    // let dateFerm=this.entityForm.controls.dateFermeture.value.day+"-"+
    //   (this.entityForm.controls.dateFermeture.value.month)+"-"+
    // this.entityForm.controls.dateFermeture.value.year
    jour=this.entityForm.controls.dateFermeture.value.day
    mois=this.entityForm.controls.dateFermeture.value.month
    annee=this.entityForm.controls.dateFermeture.value.year

    if(Number(jour)<10)
    {
      jour="0"+jour
    }
    if(Number(mois)<10)
    {
      mois="0"+mois
    }

    let dateFerm=jour+"-"+
      (mois)+"-"+annee


    this.operationpaiementrachatService.verifierPaiementRachat(this.localStore.getData("currentOpcvm").idOpcvm,
      this.localStore.getData("currentSeance").idSeanceOpcvm.idSeance,this.entityForm.value.denominationOpcvm,
      dateOuv,dateFerm).subscribe(
      (data)=>{

      })
  }
  verificationMiseAffectationEnAttente(){
    this.miseEnAffectationService.verificationMiseAffectationEnAttente(this.localStore.getData("currentOpcvm").idOpcvm)
      .subscribe((data)=>{
        if(data.data!=0)
          this.estEnAttente=true;
        else
          this.estEnAttente=false;
      })
  }
  grise()
  {
    if(this.entityForm.invalid)
      return true;
    else
      if(this.save)
        return true;
      else
        return false;
  }
  imprimer(){
    const printContent = document.getElementById("print");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  afficherSoldeCompteFormule(){
    let idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm
    this.exerciceService.afficherExerciceCourant(idOpcvm).subscribe(
      (data)=>{
        this.exercice$=data.data

        if(data.data.length==0)
          this.exerciceEnCours=false
        else
          this.exerciceEnCours=true
        //console.log(this.exercice$)
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
              this.entityForm.patchValue({solde:this.solde})
            /*console.log("idOpcvm",this.localStore.getData("currentOpcvm").idOpcvm)
            console.log("plan",this.exercice$.plan.codePlan)
            console.log("dateFErmeture",this.localStore.getData("currentSeance").dateFermeture.substring(0,10))*/
           // console.log("solde=",this.solde)
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
        if(this.operationPaiementRachat$.length!==0){
          this.save=false
        }
        else
          this.save=true

        //console.log("totalMontant",totalMontantRachat)
      }
    )
    //console.log(document.getElementById("table_PaiementRachat").getElementsByTagName('tr')[1].cells[0].innerHTML.trim())

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


    this.nbreLigne = document.getElementById("table_PaiementRachat").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    if(this.nbreLigne===1){
      alert("Aucune donnée dans le tableau")
      return
    }

    let solde=0
    let totalMontantRachat=0
    if(this.entityForm.value.solde!==null)
      solde=Number(this.entityForm.value.solde)

    if(this.entityForm.value.totalMontantRachat!==null)
      totalMontantRachat=Number(this.entityForm.value.totalMontantRachat)

    if(solde<totalMontantRachat)
    {
      alert("Solde=" + solde + "\n Total Rachat=" +totalMontantRachat +
        "\n Vous ne disposez pas d'assez de liquidité pour effectuer ces paiements");
      return;
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
    this.operationPaiementRachatTab=[]

    for (i === 1; i < this.nbreLigne; i++) {
      this.operationPaiementRachat=new Operationpaiementrachat2();
      this.operationPaiementRachat.referencePiece = "";
      // @ts-ignore
      this.operationPaiementRachat.idActionnaire=Number(document.getElementById("table_PaiementRachat").getElementsByTagName('tr')[i].cells[4].innerHTML.trim())
      this.operationPaiementRachat.idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm
      this.operationPaiementRachat.idSeance=this.entityForm.value.idSeance
      this.operationPaiementRachat.dateOperation =dateOperation;
      this.operationPaiementRachat.codeNatureOperation="PAI_RACH"
      this.operationPaiementRachat.datePiece = dateOperation;
      this.operationPaiementRachat.dateSaisie =new Date();
      this.operationPaiementRachat.montant=Number(document.getElementById("table_PaiementRachat").getElementsByTagName('tr')[i].cells[3].innerHTML.trim())
      this.operationPaiementRachat.dateValeur =dateOperation;
      this.operationPaiementRachat.idOperation = 0;
      this.operationPaiementRachat.idTransaction = 0;
      this.operationPaiementRachat.libelleOperation = "PAIEMENT SUIVANT RACHAT DE " +
        document.getElementById("table_PaiementRachat").getElementsByTagName('tr')[i].cells[3].innerHTML
      this.operationPaiementRachat.valeurCodeAnalytique = "OPC:" + this.localStore.getData("currentOpcvm").idOpcvm +
        ";ACT:" + document.getElementById("table_PaiementRachat").getElementsByTagName('tr')[i].cells[4].innerHTML.trim();
      this.operationPaiementRachat.valeurFormule = "2:" +
        Math.abs(Number(document.getElementById("table_PaiementRachat").getElementsByTagName('tr')[i].cells[3].innerHTML))
      this.operationPaiementRachat.valeurFormule = this.operationPaiementRachat.valeurFormule.replace(',','.');
      this.operationPaiementRachat.userLogin =this.authService.currentUserValue?.username

      // @ts-ignore
      this.operationPaiementRachatTab.push(this.operationPaiementRachat);
    }
    this.operationpaiementrachatService.creer(this.operationPaiementRachatTab)
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


