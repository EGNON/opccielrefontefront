import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertOptions} from "sweetalert2";
import {of, Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModeleecritureService} from "../../../services/modeleecriture.service";
import {FormuleService} from "../../../services/formule.service";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {CryptageService} from "../../../../lab/services/cryptage.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {AgentConcerne} from "../../../../crm/models/agentconcerne.model";
import {Time} from "@angular/common";
import {Personnel} from "../../../../crm/models/personne/personnel.model";
import {RDV} from "../../../../crm/models/rdv.model";
import {ModeleecritureformuleService} from "../../../services/modeleecritureformule.service";
import {Modeleecritureformule} from "../../../models/modeleecritureformule.model";
import {Modeleecriture} from "../../../models/modeleecriture.model";
import {Formule} from "../../../models/formule";
import {Pays} from "../../../../crm/models/pays.model";
import {AuthService} from "../../../modules/auth";

@Component({
    selector: 'app-modeleformule-add-edit',
    templateUrl: './modeleformule-add-edit.component.html',
    styleUrl: './modeleformule-add-edit.component.scss',
    standalone: false
})
export class ModeleformuleAddEditComponent implements OnInit, OnDestroy {
  id?: any;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  formule:any;
  idFormule:number;
  entityForm: FormGroup;
  modeleEcritureFormule:Modeleecritureformule;
  modeleEcriture:any;
  modeleEcriture$:any;
  dateAlerte:Date;
  compteComptable:any;
  compteComptableSelect:any;
  numCompteComptable:any;
  tableau:HTMLElement;
  Formule$:any;
  readOnly:boolean;
  message:string;
  nbreLigne: number;
  formuleSelectionne: Formule[] = [];
  public formuleSettings = {};
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
    private entityService: ModeleecritureService,
    private formuleService: FormuleService,
    public authService: AuthService,
    private modeleEcritureFormuleService: ModeleecritureformuleService,
    private compteComptableService: ComptecomptableService,
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
    this.entityForm = this.fb.group(
      {
        id: [null],
        libelleModeleEcriture: [null, Validators.required],
        codeModeleEcriture: [null, Validators.required],
        formule: [null],
        modeleEcritureFormules: [null],
      }
    );
    //this.afficherCompteComptable()
    this.afficherFormule()
    this.readOnly=false;
    // this.afficherCategorie();
    if (this.id) {
      this.readOnly=true;
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de Modèle formule")
      const sb = this.entityService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de Modèle formule")
    }

    this.formuleSettings = {
      singleSelection: false,
      idField: 'idFormule',
      textField: 'libelleFormule',
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
  afficherFormule(){
    this.formuleService.afficherTous().subscribe(
      (data)=>{
        this.Formule$=data.data;
        this.formule=data.data;
      }
    )
  }
  get modeleEcritureFormules(): FormArray { return <FormArray>this.entityForm.get('modeleEcritureFormules')}

  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  addRow(id: string) {
    if(this.entityForm.value.formule.idFormule!=undefined ||
      this.entityForm.value.formule.idFormule!=null)
    {
      this.idFormule=this.entityForm.value.formule.idFormule;
    }
    else
    {

      return
    }
    this.formuleService.getById(this.idFormule).subscribe(
      (data) => {
        //this.personnel2$ = data;
        this.formule = data.data;
        // @ts-ignore
        this.tableau = document.getElementById(id);
        let nbreLigne = this.tableau.getElementsByTagName('tr').length
        let ajouter = true;
        // if(nbreLigne==0){
        //   ajouter=true;
        // }
        for (let i = 1; i < nbreLigne; i++) {
          if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML===this.formule.idFormule.toString()) {
            ajouter = false;
          }
        }
        if (ajouter) {
          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.formule.idFormule.toString();
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
          td.innerHTML = this.formule.libelleFormule;
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
          alert("cette formule a déjà été ajoutée")
        }
      }
    );

  }
  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_Formule");
    let length = this.tableau.getElementsByTagName('tr').length
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
    this.compteComptableService.afficherTous("PCIA").subscribe(
      (data)=>{
        this.compteComptable=data.data;
        console.log(this.compteComptable)
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
    this.entityForm.patchValue({libelleModeleEcriture: entity.libelleModeleEcriture});
    this.entityForm.patchValue({codeModeleEcriture: entity.codeModeleEcriture});
    this.entityForm.patchValue({Formule: entity.Formule});
    this.entityForm.patchValue({numCompteComptable: entity.numCompteComptable});
    if(entity.modeleEcritureFormules != null && entity.modeleEcritureFormules.length > 0)
    {
      this.formuleSelectionne=[];
      for (let i = 0; i < entity.modeleEcritureFormules.length; i++) {
        this.formuleSelectionne.push(entity.modeleEcritureFormules[i].formule)
      }
      this.modeleEcritureFormules.patchValue(this.formuleSelectionne);
    }
    else
    {
      this.formuleSelectionne=[];
      this.modeleEcritureFormules.patchValue(this.formuleSelectionne);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.entityForm.controls;
  }
  onSaveEntity() {

    const sb = this.saveEntity().pipe(
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/app/standard/parametre/comptabilite/modeleformule']);
      })
    )
      .subscribe(
        (data)=> {
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
   let entity :any;
    if(this.entityForm.value.modeleEcritureFormules!=null)
    {
      entity={
        ...this.entityForm.value,
        id:this.id,
        userLogin:this.authService.currentUserValue?.username,
        modeleEcritureFormules: this.entityForm.value.modeleEcritureFormules.map((u: any) => {
          return {modeleEcriture: null, formule: u};
        })}
    }
    else
    {
      entity={
        ...this.entityForm.value,
        userLogin:this.authService.currentUserValue?.username,
        id:this.id
      }

    }
    if(this.id)
    {
      this.modeleEcritureFormuleService.supprimerSelonModeleEcriture(this.entityForm.value.codeModeleEcriture).subscribe()
    }
    console.log(entity)
    return this.id
      ? this.entityService.update(entity)
      : this.entityService.create(entity);
  }
}

