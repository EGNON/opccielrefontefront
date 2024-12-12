import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, Subscription, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {RdvService} from "../../../services/rdv.service";
import {PersonneService} from "../../../services/personne/personne.service";
import {VilleService} from "../../../services/ville.service";
import {QuartierService} from "../../../services/quartier.service";
import {PaysService} from "../../../services/pays.service";
import {Personnephysiquemorale} from "../../../models/personne/personnephysiquemorale.model";
import {AgentConcerne} from "../../../models/agentconcerne.model";
import {AgentConcerneService} from "../../../services/agentconcerne.service";
import {Personnel} from "../../../models/personne/personnel.model";
import {PersonnelService} from "../../../services/personne/personnel.service";
import {Time} from "@angular/common";
import {Personne} from "../../../models/personne/personne.model";
import {PieceJointe} from "../../../models/piece-jointe.model";
import {Typedocument} from "../../../models/typedocument.model";
import {TypeDocumentService} from "../../../services/type-document.service";
import {Compterendu} from "../../../models/compterendu.model";
import {FileUploadService} from "../../../services/file-upload.service";
import {Dossier} from "../../../models/dossier.model";
import {RDV} from "../../../models/rdv.model";
import {MailSenderService} from "../../../services/mailsender.service";
import {MailService} from "../../../services/mail.service";
import {EnvoiMail} from "../../../models/envoimail.model";
import {Mail} from "../../../models/mail.model";
import {EnvoimailService} from "../../../services/envoimail.service";
import {CommuneService} from "../../../services/commune.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ModeleMsgAlerte} from "../../../models/modelemsgalerte.model";
import {ModeleMsgAlerteService} from "../../../services/modelemsgalerte.service";
import moment from "moment";
import {Typemodele} from "../../../models/typemodele.model";
import tinymce from "tinymce";

@Component({
  selector: 'app-rdv-create',
  templateUrl: './rdv-create.component.html',
  styleUrls: ['./rdv-create.component.scss']
})
export class RdvCreateComponent implements OnInit, OnDestroy {
  id?: number;
  buttonText:string;
  denomination:string;
  personnelSelectionne: Personne[] = [];
  public personnelSettings = {};
  personnelMulti:any;
  idRdv: number;
  nbreLigne: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  mailDto:any;
  envoiMail:EnvoiMail;
  formData: FormGroup;
  agentConcerneData: FormGroup;
  agentConcerneDtos:any;
  personne$:any;
  ville$:any;
  commune$:any;
  quartier$:any;
  pays$:any;
  modeleMsgAlerte$:any;
  modeleMsgAlerte:ModeleMsgAlerte;
  modeleMsgAlerte_load:any;
  idVille:number;
  idPersonne:number;
  selectElmt:any;
  selectPersonnel:any;
  selectPersonne:any;
  afficherVilleDansVue:boolean;
  afficherPersonneDansVue:boolean;
  afficherMailDansVue:boolean;
  valeurselectionnee:any;
  personnelSelectionnee:any;
  idPersonneSelectionnee:any;
  personnel$:any;
  entity:any;
  personnel2$:any;
  personnel:Personnel[];
  personnePhysiqueMorale:Personnephysiquemorale;
  agentConcerne:AgentConcerne;
  agentConcerne$:AgentConcerne[];
  tableau:HTMLElement;
  rdvDto:any;
  typeDocuments$: Observable<Typedocument[]>;
  pieceJointes: PieceJointe[];
  pieceJointe: PieceJointe;
  pieceJointe$: any;
  dossier: Dossier;
  email: string;
  personne: Personne;
  // pieceJointeSelonRDV:PieceJointe[];
  selectedFiles: { [k: string]: any } = {};
  progressInfos: any[] = [];
  message: string[] = [];
  previews = new Array<string>();

  private subscriptions: Subscription[] = [];

  constructor(
    public personnelService: PersonnelService,
    private rdvService: RdvService,
    private mailSenderService: MailSenderService,
    private agentConcerneService: AgentConcerneService,
    private personneService: PersonneService,
    private villeService: VilleService,
    private quartierService: QuartierService,
    private communeService: CommuneService,
    private paysService: PaysService,
    private modeleMsgAlerteService: ModeleMsgAlerteService,
    private typeDocService: TypeDocumentService,
    private mailService: MailService,
    private envoiMailService: EnvoimailService,
    private pieceJointeService: FileUploadService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    let dDate = new Date();
    this.formData = this.fb.group(
      {
        id: [this.id],
        idRdv: [this.id],
        dateDebRdv: [this.formatDate(dDate), Validators.required],
        dateFinRdv: [this.formatDate(dDate), Validators.required],
        heureFinRdv: [[
          (new Date().getHours()),
          (new Date().getMinutes()),
          new Date().getSeconds(),
        ].join(':'), Validators.required],
        heureDebutRdv: [[
          (new Date().getHours()),
          (new Date().getMinutes()),
          new Date().getSeconds(),
        ].join(':'), Validators.required],
        objetRdv: [null, Validators.required],
        msg: [null],
        paysDto: [null, Validators.required],
        villeDto: [null, Validators.required],
        quartierDto: [null, Validators.required],
        personnePhysiqueMoraleDto: [null, Validators.required],
        documents: this.fb.array([]),
        idModeleMsgAlerte:[null],
        agentConcerneDtos:[null, Validators.required]
      }
    );
    //tinymce.activeEditor.getBody().setAttribute('contenteditable', String(false));
    this.buttonText="Afficher le message"
    this.agentConcerneData = this.fb.group(
      {
        rdvDto: [null, Validators.required],
        personnelDto: [null, Validators.required]
      }
    );
    this.afficherVilleDansVue = false;
    this.afficherPersonneDansVue = false;
    this.afficherMailDansVue = true;
    this.afficherPersonne();
    this.afficherPays();
    this.afficherVille();
    this.afficherPersonnel();
    this.getTypeDocument();
    this.getModeleMsgAlerte()

    this.selectElmt = document.getElementById("ComboVille");
    this.selectPersonnel = document.getElementById("ComboPersonnel");
    this.selectPersonne = document.getElementById("comboPersonne");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de rendez-vous")
      this.afficherVilleDansVue=true;
      this.afficherPersonneDansVue=true;
      this.afficherMailDansVue=false;
      const sb = this.rdvService.getEntityById(this.id)
        .pipe(tap(
          entity => {
              this.loadValues(entity);
          }
        ))
        .subscribe((entity) => {
          this.entity = entity;
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de rendez-vous")

    this.personnelSettings = {
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
      itemsShowLimit: 10,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }
  get agentConcernes(): FormArray { return <FormArray>this.formData.get('agentConcerneDtos')}

  loadValues(entity:any)
  {
    this.entity=entity;
    this.formData.patchValue({paysDto: entity.paysDto});
    this.formData.patchValue({personnePhysiqueMoraleDto: entity.personnePhysiqueMoraleDto});
    // this.retournerEmail()
    this.formData.patchValue({villeDto: entity.communeDto});
    // this.afficherQuartier()
    this.formData.patchValue({quartierDto: entity.quartierDto});
    this.formData.patchValue({objetRdv: entity.objetRdv});
    this.formData.patchValue({heureFinRdv: entity.heureFinRdv});
    this.formData.patchValue({heureDebutRdv: entity.heureDebutRdv});
    let dateDebRdv = new Date(entity.dateDebRdv);
    let dateFinRdv = new Date(entity.dateFinRdv);
    this.formData.patchValue({dateDebRdv:
        this.formatDate(dateDebRdv)});
    this.formData.patchValue({dateFinRdv: this.formatDate(dateFinRdv)});
    this.agentConcerneService.afficherAgentConcerneSelonRRDV(entity.idRdv).subscribe(
      (data)=>{
        this.agentConcerne$=data;
        if(this.agentConcerne$ != null && this.agentConcerne$.length > 0)
        {
          this.personnelSelectionne=[];
          for (let i = 0; i < this.agentConcerne$.length; i++) {
            this.personnelSelectionne.push(this.agentConcerne$[i].personnelDto)
          }
          this.agentConcernes.patchValue(this.personnelSelectionne);
        }
        else
        {
          this.personnelSelectionne=[];
          this.agentConcernes.patchValue(this.personnelSelectionne);
        }

      }
    )

    /*this.agentConcerneService.afficherAgentConcerneSelonRRDV(entity.idRdv).subscribe(
      (data)=>{
        this.agentConcerne$=data;
        let i=0;
        for(i=0;i<this.agentConcerne$.length;i++)
        {
          // @ts-ignore
          this.tableau = document.getElementById("table_Charge");
          //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr

          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.agentConcerne$[i].personnelDto.idPersonne.toString();

          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
          td.hidden=true;
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.agentConcerne$[i].personnelDto.denomination;
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
          var buttonElement = document.createElement('button');
          // buttonElement.className="buttonSupprimer";
          buttonElement.style.alignContent="center";
          buttonElement.style.borderStyle="none";
          buttonElement.style.marginTop="5 px";
          // @ts-ignore
          // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
          var _this = this;
          buttonElement.addEventListener("click", function (evt)
          { return _this.removeLine(tr.rowIndex); });
          // buttonElement.onclick=this.removeLine(tr.rowIndex);
          tr.appendChild(buttonElement);
          buttonElement.innerHTML = "X";
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
        }
      }
    );*/
    this.pieceJointeService.afficherDocumentSelonRDV(entity.idRdv).subscribe(
      (data)=>{
        this.pieceJointes=data;
        let i=0;
        for(i=0;i<this.pieceJointes.length;i++)
        {
          // console.log(this.pieceJointes[i].documentDto);
          const pieceJointe:any= {
            chemin: null,
            compteRendu: null,
            dateRattachement: null,
            dateValidite: null,
            extensionDoc: this.pieceJointes[i].extensionDoc,
            id: null,
            idDoc: this.pieceJointes[i].idDoc,
            nomDoc: this.pieceJointes[i].nomDoc,
            personne: this.pieceJointes[i].personne,
            typeDocument: this.pieceJointes[i].typeDocument
          };
          // this.onAddFile();
          entity.documents[i]=this.pieceJointes[i]
          this.documents.push(this.createItem(entity.documents[i]));
          this.documents.controls[i].patchValue(entity.documents[i]);

        }
      }
    );
    //console.log(entity.modeleMsgAlerteDto)
    if(entity.modeleMsgAlerteDto!=null && entity.modeleMsgAlerteDto!=undefined){
      this.modeleMsgAlerteService.getEntityById(entity.modeleMsgAlerteDto.idModele).subscribe(
        (data)=>{
          this.modeleMsgAlerte_load=data;
          let message=this.modeleMsgAlerte_load.contenu;
          message=message.replace("{Date début}",
            moment(entity.dateDebRdv).format("DD/MM/YYYY"))
            .replace("{Date fin}",
              moment(entity.dateFinRdv).format("DD/MM/YYYY"))
            .replace("{Nom}",entity.personnePhysiqueMoraleDto.denomination)
            .replace("{Heure début}",entity.heureDebutRdv)
            .replace("{Heure fin}",entity.heureFinRdv)
          this.formData.patchValue({idModeleMsgAlerte:this.modeleMsgAlerte_load.idModele})
          this.formData.patchValue({msg:message})
          this.buttonText="Afficher le message avec les variables"
        }
      )
    }
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    //console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    //console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  private formatDate(date:Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.formData.controls;
  }

  onSaveRdv() {
    let message:string=this.formData.value.msg
    if(this.formData.value.msg!=null || this.formData.value.msg!=undefined)
    {
      if(message.indexOf("{Nom}") !=-1|| message.indexOf("{Heure début}")!=-1
      || message.indexOf("Heure fin")!=-1 || message.indexOf("Date fin")!=-1
        || message.indexOf("Date début")!=-1){
        alert("Le message du mail contient toujours des variables")
        return;
      }
    }
    // @ts-ignore
    //this.tableau = document.getElementById("table_Charge");
    //let length = this.tableau.getElementsByTagName('tr').length
    let length =2
    if (length == 1) {
      alert("Veuillez ajouter au moins un chargé")
    } else {
      this.isLoading = true;
      this.submitted = true;
      if (this.formData.invalid) return;
      const sb = this.saveRDV()
        .pipe(
          catchError((err) => {
            return of(undefined);
          }),
          finalize(() => {
            this.submitted = false;
            this.isLoading = false;
            this.router.navigate(['/crm/rendezvous/rdv']);
          })
        )
        .subscribe((data) => {
          this.rdvDto = data;
          // console.log(this.formData.get("msg")?.value);
          if (this.formData.get("msg")?.value != null) {
            let dateEnvoi=new Date();
            // @ts-ignore
            const entity: any = {
              msg:this.formData.get("msg")?.value,
              objet:this.formData.get("objetRdv")?.value,
              rdvDto:this.rdvDto,
              dateEnvoi:dateEnvoi,
              heureEnvoi:[dateEnvoi.getHours(),dateEnvoi.getMinutes(),dateEnvoi.getSeconds()].join(':')
            };
            this.mailService.create(entity).subscribe(
              (data)=>{
                this.mailDto=data;
                this.envoiMail=new class implements EnvoiMail {
                  id: any;
                  mailDto: Mail;
                  personneDto: Personne;
                };
                this.envoiMail.mailDto=new class implements Mail {
                  dateEnvoi: Date;
                  heureEnvoi: Time;
                  id: any;
                  idMail: number;
                  msg: string;
                  objet: string;
                  modeleMsgAlerte:ModeleMsgAlerte;
                };
                this.envoiMail.mailDto=this.mailDto;
                this.envoiMail.personneDto=new Personne();
                // @ts-ignore
                this.envoiMail.personneDto.idPersonne=this.idPersonneSelectionnee;
                this.envoiMailService.create(this.envoiMail).subscribe();
              }
            );
          }

          // @ts-ignore
          // this.tableau=document.getElementById("table_Charge");
          //this.nbreLigne = document.getElementById("table_Charge").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
          let i: number = 1;
          //        console.log(this.nbreLigne);
          this.agentConcerneService.supprimerAgentConcerneSelonRDV(this.rdvDto.idRdv).subscribe();
          /*for (i === 1; i < this.nbreLigne; i++) {
            this.agentConcerne = new class implements AgentConcerne {
              dateDebReelle: Date;
              dateFinReelle: Date;
              heureDebReelle: Time;
              heureFinReelle: Time;
              id: any;
              personnelDto: Personnel;
              rdvDto: RDV;
              etat: boolean;
            }
            this.agentConcerne.rdvDto = this.rdvDto;
            this.agentConcerne.personnelDto = new Personnel();
            // @ts-ignore
            this.agentConcerne.personnelDto.idPersonne = document.getElementById("table_Charge").getElementsByTagName('tr')[i].cells[0].innerHTML;
            this.agentConcerneService.saveAgent(this.agentConcerne).subscribe();
          }*/
          this.agentConcerneDtos=this.formData.value.agentConcerneDtos.map((u: any) => {
            return { personnelDto: u,rdvDto: this.rdvDto};
          })
          this.agentConcerneService.save(this.agentConcerneDtos).subscribe()

          let nbreTypeDoc = this.formData.controls.documents.value.length;
          this.pieceJointes = this.formData.controls.documents.value;
          this.pieceJointeService.supprimerDocumentSelonRDV(this.rdvDto.idRdv).subscribe();
          // console.log("pieces jointes")
          // console.log(this.pieceJointes);
          for (let i = 0; i < nbreTypeDoc; i++) {
            this.pieceJointe = new class implements PieceJointe {
              chemin: string;
              compteRendu: Compterendu;
              dateRattachement: Date;
              dateValidite: Date;
              extensionDoc: string;
              id: any;
              idDoc: number;
              nomDoc: string;
              personne: Personne;
              typeDocument: Typedocument;
              rdv: RDV;
              fToByte: any;
              fToBlob: any;
              file: any;
            };
            // @ts-ignore
            this.pieceJointe.nomDoc = this.pieceJointes[i].nomDoc;
            this.pieceJointe.extensionDoc = this.pieceJointes[i].extensionDoc;
            this.pieceJointe.typeDocument = new class implements Typedocument {
              id: any;
              idTypeDoc: number;
              libelleTypeDoc: string;
            };
            this.pieceJointe.typeDocument = this.pieceJointes[i].typeDocument;

            // @ts-ignore
            // console.log(document.getElementById("table_Charge").getElementsByTagName('tr')[l].cells[0].innerHTML);
            // // @ts-ignore
            // this.pieceJointe.personne.idPersonne=document.getElementById("table_Charge").getElementsByTagName('tr')[l].cells[0].innerHTML;
            this.pieceJointe.fToByte = this.pieceJointes[i].fToByte;
            this.dossier = new Dossier();
            let chemin = this.dossier.chemin + "\\" + this.pieceJointe.nomDoc + "." + this.pieceJointe.extensionDoc;
            const entity: any = {
              extensionDoc: this.pieceJointe.extensionDoc,
              nomDoc: this.pieceJointe.nomDoc,
              fToByte: this.pieceJointe.fToByte,
              chemin: chemin,
              typeDocument: this.pieceJointe.typeDocument,
              rdv: this.rdvDto
            };
            // console.log("piecejointe==",entity)
            this.pieceJointeService.create(entity).subscribe(
              (data) => {
                this.pieceJointe$ = data;
              }
            )
          }
          if (this.formData.get("msg")?.value !== null && this.formData.get("msg")?.value !== "") {
            let email: any[] = [];
            this.email=this.formData.value.personnePhysiqueMoraleDto.emailPerso
            //console.log("email=",this.email)
            email[0] = this.email;
            let message=this.formData.get("msg")?.value;
            let fileName:any[]=[];
            let fToByte:any[]=[];
            const entity: any = {
              recipientEmailMany: email,
              subject: this.formData.get("objetRdv")?.value,
              content: message,
              fileName: fileName,
              fToByte:fToByte
            };
            this.mailSenderService.envoyerMailAPlusieursAvecFichier(entity).subscribe();
          }
        });
      this.subscriptions.push(sb);
    }
  }

  saveRDV() {
    /*this.personnePhysiqueMorale = new class implements Personnephysiquemorale {
      denomination: string;
      id: any;
      idPersonne: number;
    };
    if(!this.id){
      this.selectPersonne = document.getElementById("comboPersonne");
      this.idPersonneSelectionnee=this.selectPersonne.options[this.selectPersonne.selectedIndex].value;
      this.personnePhysiqueMorale.idPersonne=this.idPersonneSelectionnee;
    }*/
    this.modeleMsgAlerte=new class implements ModeleMsgAlerte {
      contenu: string;
      defaut: boolean;
      id: any;
      idModele: number;
      objet: string;
      typeModele: Typemodele;
      rdvs:RDV[];
    };
    this.modeleMsgAlerte.idModele=this.formData.value.idModeleMsgAlerte
    let entity: any=null;
    //if(this.id){
      entity = {
        ...this.formData.value,
        modeleMsgAlerteDto:this.modeleMsgAlerte
      };
    /*}
    else {
      entity = {
        ...this.formData.value,
        personnePhysiqueMoraleDto: this.personnePhysiqueMorale
      };
    }*/

    return this.id
      ? this.rdvService.update(entity)
      : this.rdvService.create(entity);

  }

  afficherPersonne() {
    this.personneService.afficherPersonnePhysiqueMorale().subscribe(
      (data) => {
        this.personne$ = data;
      }
    );
  }

  getTypeDocument() {
    this.typeDocuments$ = this.typeDocService.afficherTous();
  }
  afficherMessage()
  {
    if(this.buttonText==="Afficher le message")
    {
      let message=this.formData.get('msg').value;
      message=message.replace("{Date début}",
        moment(this.formData.value.dateDebRdv).format("DD/MM/YYYY"))
        .replace("{Date fin}",
          moment(this.formData.value.dateFinRdv).format("DD/MM/YYYY"))
        .replace("{Nom}",this.formData.value.personnePhysiqueMoraleDto.denomination)
        .replace("{Heure début}",this.formData.value.heureDebutRdv)
        .replace("{Heure fin}",this.formData.value.heureFinRdv)

      this.formData.patchValue({msg:message})
      this.buttonText="Afficher le message avec les variables"
    }
    else
    {
      this.getModeleMsgAlerte()
      this.buttonText="Afficher le message"
    }

  }
  getModeleMsgAlerte(){
    this.modeleMsgAlerteService.afficherSelonTypeModeleEtDefaut("Rendez-vous").subscribe(
      (data)=>{
        this.modeleMsgAlerte$=data;
        if(data!==null){
          this.formData.patchValue({msg:data.contenu})
          this.formData.patchValue({idModeleMsgAlerte:data.idModele})
        }
      }
    )
  }
  afficherPersonnel() {
    this.personnelService.afficherPersonnelSelonEstCommercial().subscribe(
      (data) => {
        this.personnel$ = data;
        this.personnelMulti=data;
        // console.log("personnel=",this.personnel$)
      }
    );
  }

  afficherPersonnelSelonId(id: number) {
    //    const sb = this.personnePhysiqueService.getItemById(id)
    //      .pipe(first())
    //      .subscribe((x) => this.personnePhysique2$=x);
    // this.subscriptions.push(sb);
    this.personnelService.afficherPersonnelSelonId(id).subscribe(
      (data) => {
        this.personnel2$ = data;
        this.retournerPersonnePhysique(data);
      }
    );
  }

  afficherVille() {
    this.communeService.afficherCommuneListe().subscribe(
      (data) => {
        this.commune$ = data;
      }
    );
  }

  afficherPays() {
    this.paysService.afficherPaysListe().subscribe(
      (data) => {
        this.pays$ = data;
      }
    );
  }

  afficherQuartier() {
    this.valeurselectionnee = this.selectElmt.options[this.selectElmt.selectedIndex].text;
    // this.idVille = this.valeurselectionnee;
    this.quartierService.afficherQuartierListe(this.valeurselectionnee).subscribe(
      (data) => {
        this.quartier$ = data;
      }
    );
    // this.formData.patchValue({"quartierDto":this.quartier$});
  }

  retournerEmail(){
    /*if(!this.id)
      this.selectPersonne = document.getElementById("comboPersonne");
    else
      this.selectPersonne = document.getElementById("comboPersonne2");*/

    this.idPersonneSelectionnee=this.formData.value.personnePhysiqueMoraleDto.idPersonne//this.selectPersonne.options[this.selectPersonne.selectedIndex].value;
    this.denomination=this.formData.value.personnePhysiqueMoraleDto.denomination//this.selectPersonne.options[this.selectPersonne.selectedIndex].text
    this.email=this.formData.value.personnePhysiqueMoraleDto.emailPerso
    console.log(this.email)
    /*this.personneService.afficherPersonneSelonId(this.idPersonneSelectionnee).subscribe(
      (data) => {
        this.personne = data;
        this.email = this.personne.emailPerso;
      });*/
  }

  retournerPersonnePhysique(personnel: any) {
    this.personnel = personnel;
    // console.log(this.personnePhysique);
  }

  retournerPersonne() {
    this.personnelSelectionnee = this.selectPersonnel.options[this.selectPersonnel.selectedIndex].value;
    this.idPersonne = this.personnelSelectionnee;
    // console.log(this.idPersonne);
    // this.afficherPersonnelSelonId(this.idPersonne);
    // console.log(this.personnePhysique);
    // console.log(this.personnePhysique2$);
    // this.personnePhysique=this.personnePhysique2$;
  }

  addRow(id: string) {
   /* this.personnelService.afficherPersonnelSelonId(this.idPersonne).subscribe(
      (data) => {
        this.personnel2$ = data;
        this.personnel = data;
        // this.retournerPersonnePhysique(data);
        //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr
        //var tds = this.tableau.getElementsByTagName('tr')[0].getElementsByTagName('td').length;
        // @ts-ignore
        this.tableau = document.getElementById(id);
        var nbreLigne = this.tableau.getElementsByTagName('tr').length
        var ajouter = true;
        // if(nbreLigne==0){
        //   ajouter=true;
        // }
        for (let i = 1; i < nbreLigne; i++) {
          if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML.indexOf(this.personnel.idPersonne.toString()) != -1) {
            ajouter = false;
          }
        }
        if (ajouter) {
          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.personnel.idPersonne.toString();
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          td.hidden = true;
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.personnel.nom + " " + this.personnel.prenom;
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
        } else {
          alert("ce chargé a déjà été ajouté")
        }
      }
    );*/

  }

  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_Charge");
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

  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }

  getFileName(file: any) {
    let filename: string = '';
    if (file) {
      const reader = new FileReader();
      filename = file.name

      let last_dot = filename.lastIndexOf('.');
      // let ext = filename.slice(last_dot + 1);
      filename = filename.slice(0, last_dot);
    }

    return filename;
  }

  onClick(id: string) {
    document.getElementById(id)?.click();
  }

  getFileExtension(file: any) {
    let result: string = '';
    if (file) {
      const reader = new FileReader();
      const filename = file.name

      let last_dot = filename.lastIndexOf('.');
      result = filename.slice(last_dot + 1);
    }

    return result;
  }

  onAddFile() {
    this.documents.push(this.createItem({
      idDoc: null,
      dateValidite: null,
      dateRattachement: null,
      chemin: null,
      nomDoc: null,
      extensionDoc: null,
      typeDocument: null,
      compteRendu: null,
      fToByte: null,
      personne: null
    }));
  }

  onDeleteFile(index: number) {
    this.documents.removeAt(index);
  }

  selectFiles(index: number, event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      let file = this.selectedFiles[0];
      let fileToByte = this.fileToByte(file);
      const filename = file.name

      let last_dot = filename.lastIndexOf('.');
      let ext = filename.slice(last_dot + 1);
      let name = filename.slice(0, last_dot);

      let doc: any = {
        ...this.documents.controls[index].value,
        nomDoc: name,
        fToByte: fileToByte,
        extensionDoc: ext
      };
      this.documents.controls[index].patchValue(doc);
    }
  }

  get documents(): FormArray {
    return <FormArray>this.formData.get('documents')
  }

  fileToByte(myFile: any) {
    var reader = new FileReader();
    var fileByteArray: any[] = [];
    reader.readAsArrayBuffer(myFile);
    reader.onloadend = function (evt: any) {
      if (evt.target.readyState == FileReader.DONE) {
        // var arrayBuffer = evt.target.result,
        //   array = new Uint8Array(arrayBuffer);
        // for (var i = 0; i < array.length; i++) {
        //   fileByteArray.push(array[i]);
        // }
        let arrayBuffer = evt.target.result,
          array = new Uint8Array(arrayBuffer);
        for (var byte of array) {
          fileByteArray.push(byte);
        }
      }
    }
    return fileByteArray;
  }

  protected readonly onclick = onclick;
}
