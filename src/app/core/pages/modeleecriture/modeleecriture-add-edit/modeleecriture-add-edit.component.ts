import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Modeleecritureformule} from "../../../models/modeleecritureformule.model";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModeleecritureService} from "../../../services/modeleecriture.service";
import {FormuleService} from "../../../services/formule.service";
import {ModeleecritureformuleService} from "../../../services/modeleecritureformule.service";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {Formule} from "../../../models/formule";
import {ModeleecriturenatureoperationService} from "../../../services/modeleecriturenatureoperation.service";
import {TypeoperationService} from "../../../services/typeoperation.service";
import {TypetitreService} from "../../../services/typetitre.service";
import {NatureoperationService} from "../../../services/natureoperation.service";
import {DetailmodeleService} from "../../../services/detailmodele.service";
import {Detailmodele} from "../../../models/detailmodele.model";

@Component({
  selector: 'app-modeleecriture-add-edit',
  templateUrl: './modeleecriture-add-edit.component.html',
  styleUrl: './modeleecriture-add-edit.component.scss'
})
export class ModeleecritureAddEditComponent implements OnInit, OnDestroy {
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
  detailModele$:any;
  detailModeleTab:Detailmodele[];
  modeleEcriture:any;
  codeTypeOperation:string;
  codeModeleEcriture:string;
  modeleEcriture$:any;
  dateAlerte:Date;
  compteComptable$:any;
  compteComptableSelect:any;
  numCompteComptable:any;
  tableau:HTMLElement;
  Formule$:any;
  typeTitre$:any;
  natureOperation$:any;
  typeOperation$:any;
  message:string;
  nbreLigne: number;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @Input() entity: any;
  @Input() compteComptable2: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private entityService: ModeleecriturenatureoperationService,
    private formuleService: FormuleService,
    private modeleEcritureFormuleService: ModeleecritureformuleService,
    private modeleEcritureService: ModeleecritureService,
    private compteComptableService: ComptecomptableService,
    private typeOperationService: TypeoperationService,
    private typeTitreService: TypetitreService,
    private detailModeleService: DetailmodeleService,
    private natureOperationService: NatureoperationService,
    private cryptageService: CryptageService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dateAlerte = new Date();

    this.id = this.route.snapshot.params['id'];
    this.id2 = this.route.snapshot.params['id2'];
    this.id3 = this.route.snapshot.params['id3'];
    this.entityForm = this.fb.group(
      {
        id: [null],
        modeleEcriture: [null, Validators.required],
        compteComptable: [null],
        typeTitre: [null, Validators.required],
        typeOperation: [null, Validators.required],
        natureOperation: [null, Validators.required],
        formule: [null],
      }
    );
    this.afficherCompteComptable()
    this.afficherTypeOperation()
    this.afficherTypeTitre()
    this.afficherModeleEcriture()
    // this.afficherCategorie();
    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de Modèle écriture")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        {
           console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de Modèle écriture")
    }
  }
  afficherFormule(){
    this.codeModeleEcriture=this.entityForm.value.modeleEcriture.codeModeleEcriture
    this.modeleEcritureFormuleService.afficherSelonModeleEcriture(this.codeModeleEcriture).subscribe(
      (data)=>{
        this.Formule$=data.data;
        // console.log(this.Formule$)
      }
    )
    // @ts-ignore
    this.tableau = document.getElementById('table_Compte');
    var nbreLigne = this.tableau.getElementsByTagName('tr').length
    var ajouter = true;

    for (let i = 1; i < nbreLigne; i++) {
      this.removeLine(1);
    }
    this.loadValuesSelonModeleEcriture(this.codeModeleEcriture)
  }
  loadValuesSelonModeleEcriture(code:string){
    this.detailModeleService.afficherSelonModeleEcriture(code).subscribe(
      (data)=>{
        this.detailModele$=data.data;
        // console.log("detailModele==",this.detailModele$)
        let i=0;
        for(i=0;i<this.detailModele$.length;i++)
        {
          var option=this.detailModele$[i].sensMvt
          // @ts-ignore
          this.tableau = document.getElementById("table_Compte");
          //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr

          var tr = document.createElement('tr'); //On créé une ligne
          var td_id = document.createElement('td');
          tr.appendChild(td_id);
          td_id.innerHTML = this.detailModele$[i].formule.idFormule.toString();
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          td_id.hidden = true;
          if(option==="C")
          {
            var td_credit1 = document.createElement('td');
            tr.appendChild(td_credit1);
            td_credit1.innerHTML = "";
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
            var td_credit2 = document.createElement('td');
            tr.appendChild(td_credit2);
            td_credit2.innerHTML = this.detailModele$[i].numCompteComptable;
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
          }
          else
          {
            var td_debit1 = document.createElement('td');
            tr.appendChild(td_debit1);
            td_debit1.innerHTML = this.detailModele$[i].numCompteComptable;
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }

            var td_debit2 = document.createElement('td');
            tr.appendChild(td_debit2);
            td_debit2.innerHTML = "";
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
          }
          let td_libelle = document.createElement('td');
          tr.appendChild(td_libelle);

          let td_type = document.createElement('td');
          let num=this.detailModele$[i].numCompteComptable
          this.compteComptableService.afficherSelonNumCompteComptable(this.detailModele$[i].numCompteComptable).subscribe(
            (data)=>{
              td_libelle.innerHTML = data.data.libelleCompteComptable;
              td_type.innerHTML = data.data.type;
              // console.log("num("+num+")==",data.data.libelleCompteComptable)
            }
          )

          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_formule = document.createElement('td');
          tr.appendChild(td_formule);
          td_formule.innerHTML = this.detailModele$[i].formule.libelleFormule;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          tr.appendChild(td_type);

          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_Sens = document.createElement('td');
          tr.appendChild(td_Sens);
          td_Sens.innerHTML = option;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          td_Sens.hidden = true;
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
    );
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
  addRow(id: string,option:string) {

        // @ts-ignore
        this.tableau = document.getElementById(id);
        var nbreLigne = this.tableau.getElementsByTagName('tr').length
        var ajouter = true;
        // if(nbreLigne==0){
        //   ajouter=true;
        // }
        for (let i = 1; i < nbreLigne; i++) {
          if (this.tableau.getElementsByTagName('tr')[i].cells[1].innerHTML===this.entityForm.value.compteComptable.numCompteComptable.toString() ||
            this.tableau.getElementsByTagName('tr')[i].cells[2].innerHTML===this.entityForm.value.compteComptable.numCompteComptable.toString()) {
            ajouter = false;
          }
        }
        if (ajouter) {
          var tr = document.createElement('tr'); //On créé une ligne
          var td_id = document.createElement('td');
          tr.appendChild(td_id);
          td_id.innerHTML = this.entityForm.value.formule.formule.idFormule.toString();
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          td_id.hidden = true;
          if(option==="C")
          {
            var td_credit1 = document.createElement('td');
            tr.appendChild(td_credit1);
            td_credit1.innerHTML = "";
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
            var td_credit2 = document.createElement('td');
            tr.appendChild(td_credit2);
            td_credit2.innerHTML = this.entityForm.value.compteComptable.numCompteComptable;
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
          }
          else
          {
            var td_debit1 = document.createElement('td');
            tr.appendChild(td_debit1);
            td_debit1.innerHTML = this.entityForm.value.compteComptable.numCompteComptable;
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }

            var td_debit2 = document.createElement('td');
            tr.appendChild(td_debit2);
            td_debit2.innerHTML = "";
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
          }
          var td_libelle = document.createElement('td');
          tr.appendChild(td_libelle);
          td_libelle.innerHTML = this.entityForm.value.compteComptable.libelleCompteComptable;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_formule = document.createElement('td');
          tr.appendChild(td_formule);
          td_formule.innerHTML = this.entityForm.value.formule.formule.libelleFormule;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_type = document.createElement('td');
          tr.appendChild(td_type);
          td_type.innerHTML = this.entityForm.value.compteComptable.type;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_Sens = document.createElement('td');
          tr.appendChild(td_Sens);
          td_Sens.innerHTML = option;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          td_Sens.hidden = true;
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
          alert("ce compte a déjà été ajouté")
        }
  }
  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_Compte");
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

  afficherCompteComptable(){
    this.compteComptableService.afficherTous().subscribe(
      (data)=>{
        this.compteComptable$=data.data;
        // console.log(this.compteComptable$)
      }
    )
  }
  compteComptableChange()
  {
    this.compteComptableSelect = document.getElementById("compteComptable");
    this.numCompteComptable=this.compteComptableSelect.options[this.compteComptableSelect.selectedIndex].value;
    this.entityForm.patchValue({numCompteComptable:this.numCompteComptable});
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
      this.entityForm.patchValue({typeOperation: entity.natureOperation.typeOperation});
      this.entityForm.patchValue({natureOperation: entity.natureOperation});
      this.entityForm.patchValue({typeTitre: entity.typeTitre});
      this.entityForm.patchValue({modeleEcriture: entity.modeleEcriture});

    this.detailModeleService.afficherSelonModeleEcriture(entity.modeleEcriture.codeModeleEcriture).subscribe(
      (data)=>{
        this.detailModele$=data.data;
        // console.log("detailModele==",this.detailModele$)
        let i=0;
        for(i=0;i<this.detailModele$.length;i++)
        {
          var option=this.detailModele$[i].sensMvt
          // @ts-ignore
          this.tableau = document.getElementById("table_Compte");
          //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr

          var tr = document.createElement('tr'); //On créé une ligne
          var td_id = document.createElement('td');
          tr.appendChild(td_id);
          td_id.innerHTML = this.detailModele$[i].formule.idFormule.toString();
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          td_id.hidden = true;
          if(option==="C")
          {
            var td_credit1 = document.createElement('td');
            tr.appendChild(td_credit1);
            td_credit1.innerHTML = "";
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
            var td_credit2 = document.createElement('td');
            tr.appendChild(td_credit2);
            td_credit2.innerHTML = this.detailModele$[i].numCompteComptable;
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
          }
          else
          {
            var td_debit1 = document.createElement('td');
            tr.appendChild(td_debit1);
            td_debit1.innerHTML = this.detailModele$[i].numCompteComptable;
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }

            var td_debit2 = document.createElement('td');
            tr.appendChild(td_debit2);
            td_debit2.innerHTML = "";
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
          }
          let td_libelle = document.createElement('td');
          tr.appendChild(td_libelle);

          let td_type = document.createElement('td');
          let num=this.detailModele$[i].numCompteComptable
          this.compteComptableService.afficherSelonNumCompteComptable(this.detailModele$[i].numCompteComptable).subscribe(
            (data)=>{
              td_libelle.innerHTML = data.data.libelleCompteComptable;
              td_type.innerHTML = data.data.type;
              console.log("num("+num+")==",data.data.libelleCompteComptable)
            }
          )

          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_formule = document.createElement('td');
          tr.appendChild(td_formule);
          td_formule.innerHTML = this.detailModele$[i].formule.libelleFormule;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          tr.appendChild(td_type);

          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          var td_Sens = document.createElement('td');
          tr.appendChild(td_Sens);
          td_Sens.innerHTML = option;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          // td_Sens.hidden = true;
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
    );
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

    const sb = this.saveEntity().pipe(
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/modeleecriture']);
      })
    )
      .subscribe(
        (data)=> {
          this.modeleEcriture=data?.data;
          console.log("detailModeleTab",this.detailModeleTab)
          this.detailModeleService.enregistrer(this.detailModeleTab).subscribe()
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    const entity = {
      ...this.entityForm.value,
      // codeFormeJuridique: this.id ? this.id : null,
      id: this.id ? this.id : null,
    };
    console.log(entity)
    this.detailModeleService.supprimerSelonModeleEcriture
    (this.entityForm.value.modeleEcriture.codeModeleEcriture.trim()).subscribe(
      (data)=>{
        // console.log("delete==",data)
      }
    );
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}


