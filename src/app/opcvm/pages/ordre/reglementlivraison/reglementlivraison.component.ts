import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {Natureoperation} from "../../../../core/models/natureoperation.model";
import {Config} from "datatables.net";
import {Opcvm} from "../../../../core/models/opcvm";
import {EnvoiMail} from "../../../../crm/models/envoimail.model";
import {PieceJointe} from "../../../../crm/models/piece-jointe.model";
import {DocumentMail} from "../../../../crm/models/documentmail.model";
import {Dossier} from "../../../../crm/models/dossier.model";
import {SweetAlertOptions} from "sweetalert2";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OperationpaiementrachatService} from "../../../services/operationpaiementrachat.service";
import {FormuleService} from "../../../../core/services/formule.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ExerciceService} from "../../../services/exercice.service";
import {EnvoimailService} from "../../../../crm/services/envoimail.service";
import {MailService} from "../../../../crm/services/mail.service";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {DocumentmailService} from "../../../../crm/services/documentmail.service";
import {MailSenderService} from "../../../../crm/services/mailsender.service";
import {MiseenaffectationService} from "../../../services/miseenaffectation.service";
import {OperationsouscriptionrachatService} from "../../../services/operationsouscriptionrachat.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {LoaderService} from "../../../../loader.service";
import {LocalService} from "../../../../services/local.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbActiveModal, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AvisoperationbourseService} from "../../../services/avisoperationbourse.service";

@Component({
    selector: 'app-reglementlivraison',
    templateUrl: './reglementlivraison.component.html',
    styleUrl: './reglementlivraison.component.scss',
    standalone: false
})
export class ReglementlivraisonComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idSeance:number;
  nbreLigne:number;
  verifier:boolean;
  idOperationTab:any[];
  exerciceEnCours:boolean;
  personne:Personne;
  natureOperation:Natureoperation;
  datatableConfig: Config = {};
  submitted = false;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  operationSouscriptionRachat$:any;
  opcvm:Opcvm;
  avisOperation$:any;
  exercice$:any;
  save:boolean;
  solde:any;
  qualite:any;
  email:string;
  avisOperationBourse$:any;
  swalOptions: SweetAlertOptions = {};
  seance:any;
  estAfficher:boolean;
  estEnAttente:boolean;
  private clickListener: () => void;
  private idInAction: number;
  entityForm: FormGroup;

  // @ts-ignore
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: AvisoperationbourseService,
    private pageInfo: PageInfoService,
    public exerciceService: ExerciceService,
    private loadingService: LoaderService,
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
    this.qualite = this.route.snapshot.params['qualite'];
    this.entityForm = this.fb.group(
      {
        denominationOpcvm: [null],
        idSeance: [null],
        dateDebut: [null],
        dateFin: [null],
        solde: [null],
        totalMontantRachat: [null],
      }
    );
    if(this.qualite==="tous"){
      this.estAfficher=false
    }
    else
      this.estAfficher=true

    this.idOperationTab=[];
    this.pageInfo.updateTitle("REGLEMENT-LIVRAISON")
    this.loadingService.setLoading(false);
    this.save=false
    //console.log(this.localStore.getData("currentSeance"))
    this.reglementLivraison()
  }
  reglementLivraison(){
    this.entityService.afficherReglementLivraison(this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.avisOperationBourse$=data.data
        console.log(this.avisOperationBourse$)
      }
    )
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getIdOperation(isSelected, idOperation){
    // console.log(isSelected, idOperation)

    if(isSelected==true)
      this.idOperationTab.push(idOperation)
    else
    {
      let index=this.idOperationTab.indexOf(idOperation)
      if(index!==-1)
        this.idOperationTab.splice(index,1)
    }
    // console.log(this.idOperationTab)
  }
  generatePdf(){
    //this.nbreLigne = document.getElementById("table_AvisOperation").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    if(this.idOperationTab.length===0){
      alert("Veuillez cocher les opérations s'il vous plait")
      return
    }
    let id=""
    let l=0
    for(l===0;l<this.idOperationTab.length;l++){
      if(l===0)
        id=this.idOperationTab[l]
      else
        id+=","+this.idOperationTab[l]
    }

  }
  convertBlobToBytes(blob: any): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result));
        } else {
          reject(new Error("Error al convertir Blob en bytes"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Error al leer el Blob"));
      };

      reader.readAsArrayBuffer(blob);
    });
  }
  envoyer(){
    //this.nbreLigne = document.getElementById("table_AvisOperation").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    if(this.idOperationTab.length===0){
      alert("Veuillez cocher les opérations s'il vous plait")
      return
    }
    // let id=""
    // let l=0
    // for(l===0;l<this.idOperationTab.length;l++){
    //   if(l===0)
    //     id=this.idOperationTab[l]
    //   else
    //     id+=","+this.idOperationTab[l]
    // }

    // if(this.idOperationTab.length===0){
    //   alert("Veuillez cocher les opérations s'il vous plait")
    //   return
    // }
    this.loadingService.setLoading(true);
    let id=""
    let l=0
    for(l===0;l<this.idOperationTab.length;l++){
      if(l===0)
        id=this.idOperationTab[l]
      else
        id+=","+this.idOperationTab[l]
    }
    // this.operationsouscriptionrachatService.avisOperationPdf2(id).subscribe(
    //   (data)=>{
    //     alert("Envoi effectué avec succès")
    //   }
    // )
    this.loadingService.setLoading(false);

    let fToByte:any[]=[];
    let fFileName:any[]=[];

  }

  enregistrer(){

  }
}


