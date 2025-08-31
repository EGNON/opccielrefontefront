import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {Detailprofil} from "../../../models/detailprofil.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../../../../services/local.service";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {OrdreService} from "../../../services/ordre.service";
import {OrdresignataireService} from "../../../services/ordresignataire.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Ordresignataire} from "../../../models/ordresignataire.model";
import {Ordre} from "../../../models/ordre.model";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {TitreService} from "../../../../titresciel/services/titre.service";
import {TypeordreService} from "../../../services/typeordre.service";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {Natureoperation} from "../../../../core/models/natureoperation.model";

@Component({
    selector: 'app-ordre-add-edit',
    templateUrl: './ordre-add-edit.component.html',
    styleUrl: './ordre-add-edit.component.scss',
    standalone: false
})
export class OrdreAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  titre$: any;
  typeOrdre$: any;
  personne: any;
  ordreSignataire: Ordresignataire;
  ordreSignataire$: any;
  personnePhysique$: any;
  isLoading = false;
  submitting = false;
  idPersonneTab:any[];
  paysSelect:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
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
        // souscription: [null],
        // achat: [null],
        // vente: [null],
        role: [null,Validators.required],
        titre: [null,Validators.required],
        // symboleTitre: [null],
        // designation: [null],
        // place: [null],
        // cotation: [null],
        // depositaire: [null],
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
    this.afficherIntervenant()
     if(!this.id)
      this.afficherSignataire()

    this.afficherTitre()
    this.afficherTypeOrdre()
    this.idPersonneTab=[];
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
  getPersonneSelected(index, idPersonne){
    // console.log(this.entityForm.value.checkSignataire,this.entityForm.value.idPersonne)
    // console.log(isSelected, idPersonne)
    // return
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
    // if(entity.role==="SOUSCRIPTION")
    //   this.entityForm.patchValue({souscription: true});
    // else
    //   if(entity.role==="RACHAT")
    //     this.entityForm.patchValue({rachat: true});
    //   else
    //     this.entityForm.patchValue({vente: true});

      this.entityForm.patchValue({id: entity.idOrdre});

    this.entityForm.patchValue({accepterPerte: entity.accepterPerte});
    this.entityForm.patchValue({titre: entity.titre});
    this.entityForm.patchValue({role: entity.role});
    this.entityForm.patchValue({typeOrdre: entity.typeOrdre});
    this.entityForm.patchValue({quantiteLimite: entity.quantiteLimite.toString()});
    this.entityForm.patchValue({coursLimite: entity.coursLimite.toString()});
    this.entityForm.patchValue({montantBrut: entity.montantBrut.toString()});
    this.entityForm.patchValue({interet: entity.interet.toString()});
    this.entityForm.patchValue({montantNet: entity.montantNet.toString()});
    this.entityForm.patchValue({plusOuMoinsValue: entity.plusOuMoinsValue.toString()});
    this.entityForm.patchValue({commissionPlace: entity.commissionPlace.toString()});
    this.entityForm.patchValue({commissionSGI: entity.commissionSGI.toString()});
    this.entityForm.patchValue({commissionDepositaire: entity.commissionDepositaire.toString()});
    this.entityForm.patchValue({tAF: entity.tAF.toString()});
    this.entityForm.patchValue({iRVM: entity.iRVM.toString()});


    this.ordreSignataireService.afficherListeOrdreSignataire(entity.idOrdre).subscribe(
      (data)=>{
        this.ordreSignataire$=data.data;

        // let i=0;
        //   var tr = document.createElement('tr'); //On créé une ligne
        //   var td = document.createElement('td');
        //   tr.appendChild(td);
        //   td.innerHTML = this.ordreSignataire$[i].personne.idPersonne
        //   // @ts-ignore
        //   if (this.tableau.firstChild.tagName == 'TBODY') {
        //     // @ts-ignore
        //     this.tableau.firstChild.appendChild(tr);
        //   } else {
        //     this.tableau.appendChild(tr);
        //   }
        //    td.hidden = true;
        //   var td = document.createElement('td');
        //   tr.appendChild(td);
        //   td.innerHTML = this.ordreSignataire$[i].personne.denomination;
        //   // @ts-ignore
        //   if (this.tableau.firstChild.tagName == 'TBODY') {
        //     // @ts-ignore
        //     this.tableau.firstChild.appendChild(tr);
        //   } else {
        //     this.tableau.appendChild(tr);
        //   }
        //
        //   var buttonElement = document.createElement('button');
        //   // buttonElement.className="buttonSupprimer";
        //   buttonElement.style.alignContent = "center";
        //   buttonElement.style.borderStyle = "none";
        //   buttonElement.style.marginTop = "5 px";
        //   // @ts-ignore
        //   // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
        //   var _this = this;
        //   buttonElement.addEventListener("click", function (evt) {
        //     return _this.removeLine(tr.rowIndex);
        //   });
        //   // buttonElement.onclick=this.removeLine(tr.rowIndex);
        //   tr.appendChild(buttonElement);
        //   buttonElement.innerHTML = "X";
        //
        //   // @ts-ignore
        //   if (this.tableau.firstChild.tagName == 'TBODY') {
        //     // @ts-ignore
        //     this.tableau.firstChild.appendChild(tr);
        //   } else {
        //     this.tableau.appendChild(tr);
        //   }
        }
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherSignataire(){
    this.personnePhysiqueService.afficherPersonnePhysiqueSelonQualite("SIGNATAIRES").subscribe(
      (data)=>{
        this.personnePhysique$=data
      }
    )
  }
  afficherTitre(){
    this.titreService.afficherTous().subscribe(
      (data)=>{
        this.titre$=data.data
      }
    )
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
    let idInetrvenant=this.entityForm.value.personne.idPersonne
    let role=this.entityForm.value.role.trim()
    let codeNatureOperation="";
    let libelleOperation="";
    if (role === "ACHAT")
    {
      codeNatureOperation = "ORDRE_ACH";
      libelleOperation = "ORDRE D'ACHAT DE " + this.entityForm.value.quantiteLimite +
        " " + this.entityForm.value.titre.symbolTitre;
    }
    else if (role === "VENTE")
    {
      codeNatureOperation = "ORDRE_VTE";
      libelleOperation = "ORDRE DE VENTE DE " +this.entityForm.value.quantiteLimite +
        " " + this.entityForm.value.titre.symbolTitre;
    }
    else
    {
      codeNatureOperation = "ORDRE_SOUS";
      libelleOperation = "ORDRE DE SOUSCRIPTION A " + this.entityForm.value.quantiteLimite +
        " " + this.entityForm.value.titre.symbolTitre;
    }
    let valeurFormule = "5:" + this.entityForm.value.montantBrut.replace(',', '.') +
      ";50:" + this.entityForm.value.quantiteLimite.replace(',', '.');
    let valeurCodeAnalytique = "OPC:" + this.localStore.getData("currentOpcvm")?.idOpcvm +
      ";TIT:" + this.entityForm.value.titre.idTitre;

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

    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm,
      idIntervenant:idInetrvenant,
      dateEnvoi:dateEnvoi,
      quantiteExecute:0,
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
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}
