import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {of, Subscription} from "rxjs";
import {Natureoperation} from "../../../../core/models/natureoperation.model";
import {Config} from "datatables.net";
import {Opcvm} from "../../../../core/models/opcvm";
import {SweetAlertOptions} from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OperationpaiementrachatService} from "../../../services/operationpaiementrachat.service";
import {FormuleService} from "../../../../core/services/formule.service";
import {ExerciceService} from "../../../services/exercice.service";
import {MiseenaffectationService} from "../../../services/miseenaffectation.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {LocalService} from "../../../../services/local.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbActiveModal, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OperationsouscriptionrachatService} from "../../../services/operationsouscriptionrachat.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {EnvoiMail} from "../../../../crm/models/envoimail.model";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {Dossier} from "../../../../crm/models/dossier.model";
import {PieceJointe} from "../../../../crm/models/piece-jointe.model";
import {DocumentMail} from "../../../../crm/models/documentmail.model";
import {EnvoimailService} from "../../../../crm/services/envoimail.service";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {DocumentmailService} from "../../../../crm/services/documentmail.service";
import {MailSenderService} from "../../../../crm/services/mailsender.service";
import {MailService} from "../../../../crm/services/mail.service";
import {LoaderService} from "../../../../loader.service";

@Component({
    selector: 'app-avisrachat-list',
    templateUrl: './avisrachat-list.component.html',
    styleUrl: './avisrachat-list.component.scss',
    standalone: false
})
export class AvisrachatListComponent implements OnInit, OnDestroy {
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
  email:string;
  mailDto:any;
  mailTAB:any[];
  envoiMailTab:EnvoiMail[];
  documentsTab:Document[];
  pieceJointes:PieceJointe[];
  pieceJointesTab:PieceJointe[];
  pieceJointe:PieceJointe;
  envoiMail:EnvoiMail;
  documentMail:DocumentMail;
  documentMailTab:DocumentMail[];
  dossier:Dossier;
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
    private pageInfo: PageInfoService,
    public exerciceService: ExerciceService,
    private envoiMailService: EnvoimailService,
    private mailService: MailService,
    private typeDocService: TypeDocumentService,
    private pieceJointeService: FileUploadService,
    private documentMailService: DocumentmailService,
    private mailSenderService: MailSenderService,
    public miseEnAffectationService: MiseenaffectationService,
    public operationsouscriptionrachatService:OperationsouscriptionrachatService,
    public personneService: PersonneService,
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
    this.idOperationTab=[];
    this.pageInfo.updateTitle("Rachat")
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

        let dateFermeture = new Date(this.seance.dateFermeture);
        this.entityForm.patchValue({dateDebut: new NgbDate(
            dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});

        this.entityForm.patchValue({dateFin: new NgbDate(
            dateFermeture.getFullYear(), dateFermeture.getMonth()+1, dateFermeture.getDate())});
      })
    this.save=false
    //console.log(this.localStore.getData("currentSeance"))

  }
  listeOperationSouscriptionRachat(){
    let startDate=new Date();
    let endDate=new Date();
    if(this.entityForm.controls.dateDebut.value)
    {
      startDate = new Date(
        this.entityForm.controls.dateDebut.value.year,
        this.entityForm.controls.dateDebut.value.month-1,
        this.entityForm.controls.dateDebut.value.day+1);
    }
    if(this.entityForm.controls.dateFin.value)
    {
      endDate = new Date(
        this.entityForm.controls.dateFin.value.year,
        this.entityForm.controls.dateFin.value.month-1,
        this.entityForm.controls.dateFin.value.day+1);
    }
    const beginEndDate={startDate,endDate}
    this.operationsouscriptionrachatService.listeOperationSouscriptionRachat(this.localStore.getData("currentOpcvm").idOpcvm,
      "RACH_PART".trim(),beginEndDate).subscribe(
      (data)=>{
        this.operationSouscriptionRachat$=data.data
        console.log(this.operationSouscriptionRachat$)
      }
    )
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
  /*afficherPrecalculPaiementRachat(){
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
        //console.log("totalMontant",totalMontantRachat)
      }
    )
    this.loadingService.setLoading(false)
  }*/
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getIdOperation(isSelected, idOperation){
    console.log(isSelected, idOperation)

    if(isSelected==true)
      this.idOperationTab.push(idOperation)
    else
    {
      let index=this.idOperationTab.indexOf(idOperation)
      if(index!==-1)
        this.idOperationTab.splice(index,1)
    }
    console.log(this.idOperationTab)
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
    this.operationsouscriptionrachatService.avisOperationPdf(id).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'avis_rachat.pdf';
        a.click();
      });
    // this.operationsouscriptionrachatService.avisOperation(id).subscribe(
    //   (data)=> {
    //     this.avisOperation$ = data.data
    //     let i = 0
    //     let operations = []
    //     for (i === 0; i < this.avisOperation$.length; i++) {
    //       console.log("op" + i + "=", this.avisOperation$[i])
    //       operations.push({
    //         numero: this.avisOperation$[i].idOperation,
    //         dateOperation: moment(this.avisOperation$[i].dateOperation).format('DD/MM/YYYY'),
    //         dateValeur: moment(this.avisOperation$[i].dateValeur).format('DD/MM/YYYY'),
    //         vl: this.avisOperation$[i].coursVL,
    //         Qte: this.avisOperation$[i].nombrePartSousRachat,
    //         intitule: this.avisOperation$[i].intitule,
    //         phone: this.avisOperation$[i].phone,
    //         numCompteSgi: this.avisOperation$[i].numCompteSgi,
    //         mail: this.avisOperation$[i].mail,
    //         codeNatureOperation: this.avisOperation$[i].codeNatureOperation,
    //         montantBrut: Number(this.avisOperation$[i].nombrePartSousRachat) * Number(this.avisOperation$[i].coursVL),
    //         total: Number(this.avisOperation$[i].nombrePartSousRachat) * Number(this.avisOperation$[i].coursVL) - Number(this.avisOperation$[i].commisiionSousRachat) - Number(this.avisOperation$[i].tafcommissionSousRachat),
    //         commission: this.avisOperation$[i].commisiionSousRachat,
    //         TAFA: this.avisOperation$[i].tafcommissionSousRachat,
    //         denominationOpcvm: this.avisOperation$[i].denominationOpcvm
    //       })
    //     }
    //     const doc = new jsPDF();
    //     // Liste des opérations (par exemple)
    //     // Pour chaque opération, créer une nouvelle page
    //     operations.forEach((operation, index) => {
    //
    //       if (index > 0) {
    //         doc.addPage(); // Nouvelle page après la première opération
    //       }
    //
    //       // Titre de la première page
    //       doc.setFontSize(14);
    //       doc.text('AVIS DE' + operation.codeNatureOperation, 105, 10, {align: 'center'});
    //
    //       // Détails du compte
    //       doc.setFontSize(10);
    //       doc.text('Cotonou, Le ' + moment(new Date()).format('DD/MM/YYYY hh:mm'), 10, 20);
    //       doc.text(operation.intitule, 10, 40);
    //       doc.text(operation.phone, 10, 50);
    //       doc.text(operation.mail, 10, 60);
    //       doc.text('Nous avons exécuté pour le Compte titre N°' + operation.numCompteSgi + ' ce qui suit', 10, 30);
    //
    //       // Table des opérations
    //       autoTable(doc, {
    //         startY: 70,
    //         head: [['OPERATION', 'TYPE DE FCP', 'N°OPÉRATION', 'DATE OPÉRATION', 'DATE VALEUR', 'QTE', 'VL']],
    //         body: [[operation.codeNatureOperation, operation.denominationOpcvm, operation.numero, operation.dateOperation, operation.dateValeur, operation.Qte, operation.vl]],
    //       });
    //
    //       // Montants spécifiques à l'opération
    //       doc.text('MONTANT BRUT :' + operation.montantBrut, 10, 100);
    //       doc.text('COMMISSION : ' + operation.commission, 10, 110);
    //       doc.text('TAFA :' + operation.TAFA, 10, 120);
    //       doc.text('TOTAL :' + operation.total, 10, 130);
    //       doc.text('En conséquence, nous créditons votre compte de : ' + operation.total, 10, 140);
    //       doc.text('Nous vous remercions pour votre confiance ', 10, 150);
    //
    //       doc.setFontSize(8);
    //       doc.text('Cet avis édité par ordinateur ne porte pas de signature.', 10, 250);
    //
    //       doc.text(
    //         "Capital: 250 000 000 F CFA Agrément N°SG/2017-02 CREPMF RC N° RCCM/RB/COT/15 B 14715 IFU N°: 3201502603811",
    //         10,
    //         270
    //       );
    //       doc.text(
    //         "Rue du Gouverneur Gal Félix EBOUE R. 5.160 CARRE 211 ST MICHEL IMMEUBLE SGI BENIN 01 BP 4546 COTONOU BENIN",
    //         10,
    //         275
    //       );
    //       doc.text(
    //         "Tél : (229) 21 31 15 41/ 66 18 01 74  www.saphiram.com  contact@saphiram.com",
    //         10,
    //         280
    //       );
    //     });
    //
    //     // Footer commun pour toutes les pages
    //
    //
    //     // Sauvegarder le PDF
    //      doc.save('Avis_Operation.pdf');
    //   }
    // )

}
  saveMail() {

    let dateEnvoi=new Date();
    const entity: any = {
      msg:"Cher(e) client(e), \n recevez en piece jointe votre avis d'opéré.\n Cordialement ",
      objet:"AVIS D'OPERE",
      documentMailDtos:this.documentMailTab,
      envoiMailDtos:this.envoiMailTab,
      dateEnvoi:dateEnvoi,
      heureEnvoi:[dateEnvoi.getHours(),dateEnvoi.getMinutes(),dateEnvoi.getSeconds()].join(':')
    };

    this.mailService.create(entity);

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
    this.operationsouscriptionrachatService.avisOperationPdf2(id).subscribe(
      (data)=>{
        alert("Envoi effectué avec succès")
      }
    )
    this.loadingService.setLoading(false);

    let fToByte:any[]=[];
    let fFileName:any[]=[];
  //   this.operationsouscriptionrachatService.avisOperation(id).subscribe(
  //     (data)=>{
  //       this.avisOperation$=data.data
  //       let i=0
  //       let operations=[]
  //       for(i===0;i<this.avisOperation$.length;i++){
  //         // console.log("op"+i+"=",this.avisOperation$[i])
  //       //   operations.push({
  //       //     idActionnaire:this.avisOperation$[i].idActionnaire,
  //       //     numero: this.avisOperation$[i].idOperation,
  //       //     dateOperation: moment(this.avisOperation$[i].dateOperation).format('DD/MM/YYYY'),
  //       //     dateValeur: moment(this.avisOperation$[i].dateValeur).format('DD/MM/YYYY'),
  //       //     vl:this.avisOperation$[i].coursVL,
  //       //     Qte: this.avisOperation$[i].nombrePartSousRachat,
  //       //     intitule:this.avisOperation$[i].intitule,
  //       //     phone:this.avisOperation$[i].phone,
  //       //     numCompteSgi:this.avisOperation$[i].numCompteSgi,
  //       //     mail:this.avisOperation$[i].mail,
  //       //     codeNatureOperation:this.avisOperation$[i].codeNatureOperation,
  //       //     montantBrut:Number(this.avisOperation$[i].nombrePartSousRachat)*Number(this.avisOperation$[i].coursVL),
  //       //     total:Number(this.avisOperation$[i].nombrePartSousRachat)*Number(this.avisOperation$[i].coursVL)-Number(this.avisOperation$[i].commisiionSousRachat)- Number(this.avisOperation$[i].tafcommissionSousRachat),
  //       //     commission:this.avisOperation$[i].commisiionSousRachat,
  //       //     TAFA:this.avisOperation$[i].tafcommissionSousRachat,
  //       //     denominationOpcvm:this.avisOperation$[i].denominationOpcvm
  //       //   })
  //       // }
  //       //
  //       // Liste des opérations (par exemple)
  //       // Pour chaque opération, créer une nouvelle page
  //       let email: any[] = [];
  //
  //       this.mailTAB=[]
  //       i=0;
  //
  //       operations.forEach((operation, index) => {
  //         const doc = new jsPDF();
  //
  //         // Titre de la première page
  //         doc.setFontSize(14);
  //         doc.text('AVIS DE'+operation.codeNatureOperation, 105, 10, { align: 'center' });
  //
  //         // Détails du compte
  //         doc.setFontSize(10);
  //         doc.text('Cotonou, Le '+ moment(new Date()).format('DD/MM/YYYY hh:mm'), 10, 20);
  //         doc.text(operation.intitule, 10, 40);
  //         doc.text(operation.phone, 10, 50);
  //         doc.text(operation.mail, 10, 60);
  //         doc.text('Nous avons exécuté pour le Compte titre N°'+operation.numCompteSgi+' ce qui suit', 10, 30);
  //
  //         // Table des opérations
  //         autoTable(doc, {
  //           startY: 70,
  //           head: [['OPERATION','TYPE DE FCP','N°OPÉRATION', 'DATE OPÉRATION', 'DATE VALEUR', 'QTE','VL']],
  //           body: [[operation.codeNatureOperation,operation.denominationOpcvm,operation.numero, operation.dateOperation, operation.dateValeur, operation.Qte,operation.vl]],
  //         });
  //
  //         // Montants spécifiques à l'opération
  //         doc.text('MONTANT BRUT :'+operation.montantBrut, 10, 100);
  //         doc.text('COMMISSION : '+operation.commission, 10, 110);
  //         doc.text('TAFA :'+operation.TAFA, 10, 120);
  //         doc.text('TOTAL :'+operation.total, 10, 130);
  //         doc.text('En conséquence, nous créditons votre compte de : '+operation.total, 10, 140);
  //         doc.text('Nous vous remercions pour votre confiance ', 10, 150);
  //
  //         doc.setFontSize(8);
  //         doc.text('Cet avis édité par ordinateur ne porte pas de signature.', 10, 250);
  //
  //         doc.text(
  //           "Capital: 250 000 000 F CFA Agrément N°SG/2017-02 CREPMF RC N° RCCM/RB/COT/15 B 14715 IFU N°: 3201502603811",
  //           10,
  //           270
  //         );
  //         doc.text(
  //           "Rue du Gouverneur Gal Félix EBOUE R. 5.160 CARRE 211 ST MICHEL IMMEUBLE SGI BENIN 01 BP 4546 COTONOU BENIN",
  //           10,
  //           275
  //         );
  //         doc.text(
  //           "Tél : (229) 21 31 15 41/ 66 18 01 74  www.saphiram.com  contact@saphiram.com",
  //           10,
  //           280
  //         );
  //         //doc.save('Avis_Operation.pdf');
  //
  //         const blobToBinary = async (blob) => {
  //           const buffer =  await new Response(blob).arrayBuffer();
  //
  //           const view = new Int8Array(buffer);
  //           return [...view].map((n) => n.toString(2)).join(' ');
  //         };
  //
  //         const blob = doc.output("blob");
  //         //const arrayBuffer = await new Response(blob).arrayBuffer();
  //         this.convertBlobToBytes(blob).then(value => {
  //           fFileName[i]="OPERE_COMPTE"+operation.numCompteSgi.trim()+"_OP"+operation.numero+".pdf"
  //           let fileNameParameter: any[] = [];
  //           fileNameParameter[0]=fFileName[i]
  //
  //           fToByte[i]= [...value];
  //           let blobParameter: any[] = [];
  //           blobParameter[0]=[...value]
  //
  //           this.personne = new Personne();
  //           this.personne.idPersonne = operation.idActionnaire
  //
  //
  //           email[i] = operation.mail
  //           let emailParameter: any[] = [];
  //           emailParameter[0]=email[i]
  //
  //           console.log("email=",email[i])
  //           if (email[i].trim() !== "") {
  //             this.envoiMailTab = []
  //             this.documentMailTab = []
  //             this.envoiMail = new class implements EnvoiMail {
  //               id: any;
  //               mailDto: Mail;
  //               personneDto: Personne;
  //             };
  //             this.envoiMail.mailDto = new class implements Mail {
  //               dateEnvoi: Date;
  //               heureEnvoi: Time;
  //               id: any;
  //               idMail: number;
  //               msg: string;
  //               objet: string;
  //               modeleMsgAlerte: ModeleMsgAlerte;
  //             };
  //             this.envoiMail.mailDto = this.mailDto;
  //             this.envoiMail.personneDto = new Personne();
  //             // @ts-ignore
  //             this.envoiMail.personneDto.idPersonne = operation.idActionnaire
  //             this.envoiMailTab.push(this.envoiMail);
  //
  //
  //             let url: any[] = [];
  //
  //             this.dossier = new Dossier();
  //             let chemin = ""
  //             url[i] = chemin;
  //             this.pieceJointe = new class implements PieceJointe {
  //               chemin: string;
  //               compteRendu: Compterendu;
  //               dateRattachement: Date;
  //               dateValidite: Date;
  //               extensionDoc: string;
  //               id: any;
  //               idDoc: number;
  //               nomDoc: string;
  //               personne: Personne;
  //               typeDocument: Typedocument;
  //               rdv: RDV;
  //               fToByte: any;
  //               fToBlob: any;
  //               file: any;
  //             };
  //             // @ts-ignore
  //             this.pieceJointe.nomDoc = fFileName[i].replace(".pdf","");
  //             this.pieceJointe.extensionDoc = "pdf";
  //             this.pieceJointe.typeDocument = new class implements Typedocument {
  //               id: any;
  //               idTypeDoc: number;
  //               libelleTypeDoc: string;
  //             };
  //             this.pieceJointe.typeDocument = null;
  //             this.pieceJointe.personne = new Personne();
  //
  //             // @ts-ignore
  //             this.dossier = new Dossier();
  //             //        let chemin=this.dossier.chemin+"\\"+this.pieceJointe.nomDoc+"."+this.pieceJointe.extensionDoc;
  //             // @ts-ignore
  //             this.pieceJointe.personne = new Personne();
  //             this.pieceJointe.personne.idPersonne = operation.idActionnaire
  //             this.pieceJointe.fToByte = fToByte[i];
  //             this.documentMail = new class implements DocumentMail {
  //               documentDto: PieceJointe;
  //               id: any;
  //               mailDto: Mail;
  //             }
  //             this.documentMail.documentDto = new class implements PieceJointe {
  //               chemin: string;
  //               compteRendu: Compterendu;
  //               dateRattachement: Date;
  //               dateValidite: Date;
  //               extensionDoc: string;
  //               id: any;
  //               idDoc: number;
  //               nomDoc: string;
  //               personne: Personne;
  //               typeDocument: Typedocument;
  //               rdv: RDV;
  //               fToByte: any;
  //               fToBlob: any;
  //               file: any;
  //             };
  //             this.documentMail.documentDto = this.pieceJointe
  //             this.documentMailTab.push(this.documentMail);
  //
  //             let dateEnvoi = new Date();
  //             const entity: any = {
  //               objet: "AVIS d'OPERE",
  //               msg: "Cher(e) client(e), \n recevez en piece jointe votre avis d'opéré.\n Cordialement ",
  //               documentMailDtos: this.documentMailTab,
  //               envoiMailDtos: this.envoiMailTab,
  //               dateEnvoi: dateEnvoi,
  //               heureEnvoi: [dateEnvoi.getHours(), dateEnvoi.getMinutes(), dateEnvoi.getSeconds()].join(':')
  //             };
  //             // this.mailTAB.push({
  //             //   id:null,
  //             //   objet: "AVIS d'OPERE",
  //             //   msg: "Cher(e) client(e), recevez en piece jointe votre avis d'opéré. Cordialement ",
  //             //   documentMailDtos: this.documentMailTab,
  //             //   envoiMailDtos: this.envoiMailTab,
  //             //   dateEnvoi: dateEnvoi,
  //             //   heureEnvoi: dateEnvoi.getHours()+":"+ dateEnvoi.getMinutes()+":"+dateEnvoi.getSeconds(),
  //             //   diffusionAlerteDto:null,
  //             //   modeleMsgAlerteDto:null
  //             // })
  //             console.log(entity)
  //             this.mailService.creer(entity)
  //               .subscribe((data) => {
  //                 this.mailDto = data;
  //                 //email=this.email.split(';')
  //                 const entity: any = {
  //                   recipientEmailMany: emailParameter,
  //                   subject: "AVIS d'OPERE",
  //                   content: "Cher(e) client(e), \n recevez en piece jointe votre avis d'opéré.\n Cordialement ",
  //                   fileName: fileNameParameter,
  //                   fToByte: blobParameter
  //                 };
  //                 console.log("entity==", entity);
  //                 this.mailSenderService.envoyerMailAPlusieursAvecFichier2(entity).subscribe();
  //               });
  //           }
  //
  //         })
  //
  //         // console.log("i="+i+";length=",operations.length-1)
  //         // if(i===operations.length-1){
  //         //   console.log("mail=",this.mailTAB)
  //         //   this.mailService.creer(this.mailTAB)
  //         //     .subscribe((data) => {
  //         //       this.mailDto = data;
  //         //       //email=this.email.split(';')
  //         //       const entity: any = {
  //         //         recipientEmailMany: email,
  //         //         subject: "AVIS d'OPERE",
  //         //         content: "Cher(e) client(e), \\n recevez en piece jointe votre avis d'opéré.\\n Cordialement ",
  //         //         fileName: fFileName,
  //         //         fToByte: fToByte
  //         //       };
  //         //       console.log("entity==", entity);
  //         //       this.mailSenderService.envoyerMailAPlusieursAvecFichier2(entity).subscribe();
  //         //     });
  //         // }
  //         i+=1;
  //       });
  //
  //
  //     }
  //   )
  //
  }

enregistrer(){
 /* const entity={
    idOpcvm:this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm,
    codeNatureOperation:"INT_RACH",
    niveau:"1",
    userLoginVerif:this.authService.currentUserValue?.denomination
  }*/


    /*this.nbreLigne = document.getElementById("table_PaiementRachat").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
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
      this.operationPaiementRachat.userLogin =this.authService.currentUserValue?.denomination

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
    this.loadingService.setLoading(false)*/
  }
}


