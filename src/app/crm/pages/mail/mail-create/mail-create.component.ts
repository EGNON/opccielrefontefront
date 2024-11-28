import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, retry, Subscription, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {Time} from "@angular/common";
import {Personne} from "../../../models/personne/personne.model";
import {PieceJointe} from "../../../models/piece-jointe.model";
import {PersonneService} from "../../../services/personne/personne.service";
import {EnvoimailService} from "../../../services/envoimail.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {EnvoiMail} from "../../../models/envoimail.model";
import {MailService} from "../../../services/mail.service";
import {Mail} from "../../../models/mail.model";
import {Typedocument} from "../../../models/typedocument.model";
import {TypeDocumentService} from "../../../services/type-document.service";
import {Compterendu} from "../../../models/compterendu.model";
import {DocumentmailService} from "../../../services/documentmail.service";
import {DocumentMail} from "../../../models/documentmail.model";
import {RDV} from "../../../models/rdv.model";
import {Dossier} from "../../../models/dossier.model";
import {MailSenderService} from "../../../services/mailsender.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ModeleMsgAlerte} from "../../../models/modelemsgalerte.model";

@Component({
  selector: 'app-mail-create',
  templateUrl: './mail-create.component.html',
  styleUrls: ['./mail-create.component.scss']
})
export class MailCreateComponent implements OnInit, OnDestroy{
  id?: number;
  idRdv:number;
  select:boolean;
  nbreLigne:number;
  isLoading = false;
  personneSelectionne: Personne[] = [];
  public personneSettings = {};
  submitting = false;
  submitted = false;
  formData: FormGroup;
  entity:any;
  email:string;
  envoiMailSelonMail:EnvoiMail[];
  documentMailSelonMail:DocumentMail[];
  envoiMail:EnvoiMail;
  documentMail:DocumentMail;
  documentMailTab:DocumentMail[];
  personne:Personne[];
  personneMulti:any;
  personne$:any;
  personneSelonId$:any;
  idPersonne:number;
  destinataire:string;
  selectPersonne:any;
  idPersonneSelectionnee:any;
  tableau:HTMLElement;
  mailDto:any;
  envoiMailTab:EnvoiMail[];
  documentsTab:Document[];
  pieceJointes:PieceJointe[];
  pieceJointesTab:PieceJointe[];
  pieceJointe:PieceJointe;
  pieceJointe$:any;
  private subscriptions: Subscription[] = [];
  typeDocuments$: Observable<Typedocument[]>;
  dossier:Dossier;
  selectedFiles: { [k: string]: any } = {};
  progressInfos: any[] = [];
  message: string[] = [];
  previews = new Array<string>();

  fileInfos?: Observable<any>;
  constructor(
    private mailService: MailService,
    public personneService: PersonneService,
    private envoiMailService: EnvoimailService,
    private typeDocService: TypeDocumentService,
    private pieceJointeService: FileUploadService,
    private documentMailService: DocumentmailService,
    private mailSenderService: MailSenderService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.email=""
    this.id = this.route.snapshot.params['id'];
    this.formData = this.fb.group(
      {
        id:[this.id],
        // idRdv:[this.id],
        objet: [null, Validators.required],
        msg: [null, Validators.required],
        personne: [null, Validators.required],
        documents: this.fb.array([]),
      }
    );
    this.afficherPersonne();
    this.getTypeDocument();
    // @ts-ignore
    this.selectPersonne = document.getElementById("ComboPersonne");
    if(this.id)
    {
      const sb = this.mailService.getEntityById(this.id)
        .pipe(tap(
          entity => {
            this.loadValues(entity);
          }
        ))
        .subscribe((entity)=>{
          this.entity=entity;
        });
      this.subscriptions.push(sb);
      this.pageInfo.updateTitle("Modification de mail")
    }
    else
      this.pageInfo.updateTitle("Ajout de mail")

    this.personneSettings = {
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
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
     //console.log('onItemSelect', item);
    this.select=true
    //debugger;
    this.afficherEmail(item.idPersonne)
  }
  public onDeSelect(item: any) {
     //console.log('onDeSelect', item);
    this.select=false
    this.afficherEmail(item.idPersonne);
  }

  public onSelectAll(items: any[]) {
    //debugger;
    if(items.length > 0) {
      items.forEach(item => {
        this.select=true;
        this.afficherEmail(item.idPersonne);
      });
    }
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
    this.select=false;
    this.email = '';
  }
  loadValues(entity:any)
  {
    let dateEnvoi = new Date(entity.dateEnvoi);
    this.formData.patchValue({dateEnvoi:
        this.formatDate(dateEnvoi)});
    this.formData.patchValue({msg: entity.msg});
    this.formData.patchValue({objet: entity.objet});
    this.documentMailService.afficherDocumentMailSelonMail(entity.idMail).subscribe(
      (data)=>{
        this.documentMailSelonMail=data;
        let i=0;
        // console.log(this.documentMailSelonMail.length);
        for(i=0;i<this.documentMailSelonMail.length;i++)
        {
          const pieceJointe:any= {
            chemin: null,
            compteRendu: null,
            dateRattachement: null,
            dateValidite: null,
            extensionDoc: this.documentMailSelonMail[i].documentDto.extensionDoc,
            id: null,
            idDoc: this.documentMailSelonMail[i].documentDto.idDoc,
            nomDoc: this.documentMailSelonMail[i].documentDto.nomDoc,
            personne: this.documentMailSelonMail[i].documentDto.personne,
            typeDocument: this.documentMailSelonMail[i].documentDto.typeDocument
          };
          // this.onAddFile();
          entity.documents[i]=this.documentMailSelonMail
          this.documents.push(this.createItem(entity.documents[i]));
          this.documents.controls[i].patchValue(entity.documents[i]);
        }
      }
    );
    this.envoiMailService.afficherEnvoiMailSelonMail(entity.idMail).subscribe(
      (data)=>{
        this.envoiMailSelonMail=data;
        let i=0;
        for(i=0;i<this.envoiMailSelonMail.length;i++)
        {
          // @ts-ignore
          this.tableau = document.getElementById("table_Charge");
          //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr

          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.envoiMailSelonMail[i].personneDto.idPersonne.toString();

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
          td.innerHTML = this.envoiMailSelonMail[i].personneDto.denomination;
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }

          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.envoiMailSelonMail[i].personneDto.emailPerso;
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
    );
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

  get f() { return this.formData.controls; }

  onSaveMail()
  {
    // @ts-ignore
    //this.tableau = document.getElementById("table_Charge");
    //var length = this.tableau.getElementsByTagName('tr').length

    var length = 2;
    if(this.formData.value.personne.length!==this.email.split(';').length)
    {
      alert("Veuillez attendre quelques secondes pour le chargement des emails")
    }
    else {
      this.isLoading = true;
      this.submitted = true;
      this.submitting=true;
//      if (this.formData.invalid) return;
      this.envoiMailTab=[]
      this.documentMailTab=[]
      // @ts-ignore
      this.personne=this.formData.value.personne
      this.nbreLigne = this.personne.length
      let i: number = 0;
      //        console.log(this.nbreLigne);
      let email:any[]=[];
      for (i === 0; i < this.nbreLigne; i++) {
        // @ts-ignore
        //email[i]=this.personne[i].emailPerso
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
        this.envoiMail.personneDto.idPersonne=this.personne[i].idPersonne
        this.envoiMailTab.push(this.envoiMail);
      }

      let nbreTypeDoc=this.formData.controls.documents.value.length;
      this.pieceJointes=this.formData.controls.documents.value;
      let url:any[]=[];
      let fileName:any[]=[];
      let fToByte:any[]=[];

      for(let i=0;i<nbreTypeDoc;i++)
      {
        this.dossier=new Dossier();
        let chemin=this.dossier.chemin+"\\"+this.pieceJointes[i].nomDoc+"."+
          this.pieceJointes[i].extensionDoc;
        url[i]=chemin;
        fileName[i]=this.pieceJointes[i].nomDoc+"."+ this.pieceJointes[i].extensionDoc;
        fToByte[i]=this.pieceJointes[i].fToByte
        /*let l: number = 0;
        //        console.log(this.nbreLigne);
        for (l == 0; l < this.nbreLigne; l++) {*/
          this.pieceJointe=new class implements PieceJointe {
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
            rdv:RDV;
            fToByte:any;
            file: any;
          };
          // @ts-ignore
          this.pieceJointe.nomDoc=this.pieceJointes[i].nomDoc;
          this.pieceJointe.extensionDoc=this.pieceJointes[i].extensionDoc;
          this.pieceJointe.typeDocument=new class implements Typedocument {
            id: any;
            idTypeDoc: number;
            libelleTypeDoc: string;
          };
          this.pieceJointe.typeDocument=this.pieceJointes[i].typeDocument;
          this.pieceJointe.personne=new Personne();

          // @ts-ignore
          this.dossier=new Dossier();
  //        let chemin=this.dossier.chemin+"\\"+this.pieceJointe.nomDoc+"."+this.pieceJointe.extensionDoc;
          // @ts-ignore
          this.pieceJointe.personne=this.personne[i]
          this.pieceJointe.fToByte=this.pieceJointes[i].fToByte;
          /*const entity: any = {
            extensionDoc: this.pieceJointe.extensionDoc,
            chemin:chemin,
            fToByte:this.pieceJointe.fToByte,
            nomDoc: this.pieceJointe.nomDoc,
            personne: this.pieceJointe.personne,
            typeDocument: this.pieceJointe.typeDocument
          };*/
          //this.pieceJointesTab.push(this.pieceJointe)
          /*this.pieceJointeService.create(entity).subscribe(
            (data)=>{
              this.pieceJointe$=data;*/
              // console.log(this.pieceJointe$);
              this.documentMail=new class implements DocumentMail {
                documentDto: PieceJointe;
                id: any;
                mailDto: Mail;
              }
              this.documentMail.documentDto=new class implements PieceJointe {
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
                rdv:RDV;
                fToByte:any;
                file: any;
              };
              this.documentMail.documentDto=this.pieceJointe
              this.documentMailTab.push(this.documentMail);
//            }
          /*)
        }*/
      }
      //console.log(this.formData.value.personne)
      //return;
      const sb = this.saveMail()
        .pipe(
          catchError((err) => {
            return of(undefined);
          }),
          finalize(() => {
            this.submitted = false;
            this.isLoading = false;
            this.router.navigate(['/crm/notifications/mail']);
          })
        )
        .subscribe((data) => {
          this.mailDto = data;
            email=this.email.split(';')
            const entity: any = {
              recipientEmailMany: email,
              subject:this.formData.get("objet")?.value,
              content:this.formData.get("msg")?.value,
              fileName: fileName,
              fToByte:fToByte
            };
            console.log("entity==",entity);
            this.mailSenderService.envoyerMailAPlusieursAvecFichier(entity).subscribe();
        });
      this.subscriptions.push(sb);
    }
  }
  getTypeDocument()
  {
    this.typeDocuments$ = this.typeDocService.afficherTous();
  }
  saveMail() {

     let dateEnvoi=new Date();
    const entity: any = {
      ...this.formData.value,
      documentMailDtos:this.documentMailTab,
      envoiMailDtos:this.envoiMailTab,
      dateEnvoi:dateEnvoi,
      heureEnvoi:[dateEnvoi.getHours(),dateEnvoi.getMinutes(),dateEnvoi.getSeconds()].join(':')
    };
    console.log(entity)


    return this.id
      ? this.mailService.update(entity)
      : this.mailService.create(entity);

  }
  afficherPersonne(){
    // const sb = this.personneService.isLoading$.subscribe(res => this.isLoading = res);
    // this.subscriptions.push(sb);
    // this.personneService.fetch();
    this.personneService.afficherPersonneListe().subscribe(
      (data)=>{
        console.log("Liste des personnes ", data);
        this.personne$=data;
        this.personneMulti=data;
        // console.log(this.personne$)
      }
    )
  }
  afficherEmail(id:number){
    this.personneService.afficherPersonneSelonId(id).subscribe(
      (data) => {
        this.personneSelonId$=data;
        //this.retournerPersonnePhysique(data);
        if(this.select){
          if(this.email==="")
            this.email=this.personneSelonId$.emailPerso
          else
            this.email=this.email+";"+this.personneSelonId$.emailPerso
        }
        else
        {
            this.email=this.email.replace(";"+this.personneSelonId$.emailPerso,"").
              replace(this.personneSelonId$.emailPerso,"")
          if(this.email.split(';')[0]==="")
            this.email=this.email.substring(1,this.email.length)
        }

        console.log(this.email)
      }
    );
  }

  retournerPersonnePhysique(personnel:any)
  {
    this.personne=personnel;
    // console.log(this.personnePhysique);
  }
  retournerPersonne(){
    this.idPersonneSelectionnee=this.selectPersonne.options[this.selectPersonne.selectedIndex].value;
    this.idPersonne=this.idPersonneSelectionnee;
    // this.afficherPersonnelSelonId(this.idPersonne);
    // console.log(this.personnePhysique);
    // console.log(this.personnePhysique2$);
    // this.personnePhysique=this.personnePhysique2$;


  }
  addRow(id: string){
    /*this.personneService.afficherPersonneSelonId(this.idPersonne).subscribe(
      (data) => {
        this.personneSelonId$=data;
        this.personne=data;
        // this.retournerPersonnePhysique(data);
        //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr
        //var tds = this.tableau.getElementsByTagName('tr')[0].getElementsByTagName('td').length;
        // @ts-ignore
        this.tableau = document.getElementById(id);
        var nbreLigne = this.tableau.getElementsByTagName('tr').length
        var ajouter=true;
        // if(nbreLigne==0){
        //   ajouter=true;
        // }
        for(let i=1;i<nbreLigne;i++)
        {
          if(this.tableau.getElementsByTagName('tr')[i].
            cells[0].innerHTML.indexOf(this.personne.idPersonne.toString())!=-1)
          {
            ajouter=false;
          }
        }
        if(ajouter)
        {
          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.personne.idPersonne.toString();
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
          td.innerHTML = this.personne.denomination;
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }

          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.personne.emailPerso;
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
        else
        {
          alert("ce destinataire a déjà été ajouté")
        }
      }
    );
*/
  }
  removeLine(index:number){
    // @ts-ignore
    this.tableau = document.getElementById("table_Charge");
    var length = this.tableau.getElementsByTagName('tr').length
    if(length==2)
    {
      var tr = this.tableau.getElementsByTagName('tr')[1] ;
      tr.remove();
    }
    else
    {
      var tr = this.tableau.getElementsByTagName('tr')[index];
      tr.remove();
    }
  }
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }
  getFileName(file: any)
  {
    let filename: string = '';
    if(file)
    {
      const reader = new FileReader();
      filename = file.name

      let last_dot = filename.lastIndexOf('.');
      // let ext = filename.slice(last_dot + 1);
      filename = filename.slice(0, last_dot);
    }
  }
    getChemin(file: any)
    {
      let filename: string = '';
      if(file)
      {
        const reader = new FileReader();
        filename = file.path;
      }

    return filename;
  }
  onClick(id: string) {
    document.getElementById(id)?.click();
  }
  getFileExtension(file: any)
  {
    let result: string = '';
    if(file)
    {
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
      fToByte: null,
      extensionDoc: null,
      typeDocument: null,
      compteRendu: null,
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
    // console.log(this.selectedFiles)
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      let file = this.selectedFiles[0];
      let fileToByte=this.fileToByte(file);

      const filename = file.name

      let last_dot = filename.lastIndexOf('.');
      let ext = filename.slice(last_dot + 1);
      let name = filename.slice(0, last_dot);

      let doc: any = {
        ...this.documents.controls[index].value,
        nomDoc: name,
        extensionDoc: ext,
        fToByte:fileToByte,
        chemin:file
      };
      this.documents.controls[index].patchValue(doc);
    }
  }
  get documents(): FormArray { return <FormArray>this.formData.get('documents')}
  fileToByte(myFile:any){
    var reader = new FileReader();
    var fileByteArray:any[] = [];
    reader.readAsArrayBuffer(myFile);
    reader.onloadend = function (evt:any) {
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
  fileToByteArray(file: any) {
    return new Promise((resolve, reject) => {
      try {
        let reader = new FileReader();
        let fileByteArray: any[] = [];
        reader.readAsArrayBuffer(file);
        reader.onloadend = (evt: any) => {
          if (evt.target.readyState == FileReader.DONE) {
            let arrayBuffer = evt.target.result,
              array = new Uint8Array(arrayBuffer);
            for (var byte of array) {
              fileByteArray.push(byte);
            }
          }
          resolve(fileByteArray);
        }
      }
      catch (e) {
        reject(e);
      }
    })
  }
}


