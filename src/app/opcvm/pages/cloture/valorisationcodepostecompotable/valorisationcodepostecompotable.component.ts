import {
  AfterContentInit,
  AfterViewInit, ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {OperationdifferenceestimationService} from "../../../services/operationdifferenceestimation.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {LocalService} from "../../../../services/local.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import {PostecomptableseanceopcvmService} from "../../../services/postecomptableseanceopcvm.service";
import {OperationService} from "../../../services/operation.service";
import {Opcvm} from "../../../../core/models/opcvm";
import {Operationchargeaetaler} from "../../../models/operationchargeaetaler.model";
import {Postecomptableseanceopcvm} from "../../../models/postecomptableseanceopcvm.model";
import {Plan} from "../../../../core/models/plan.model";

@Component({
  selector: 'app-valorisationcodepostecompotable',
  templateUrl: './valorisationcodepostecompotable.component.html',
  styleUrl: './valorisationcodepostecompotable.component.scss'
})
export class ValorisationcodepostecompotableComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;
  listeAvisForm: any
  opcvm: Opcvm

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
  posteComptableSeanceOpcvm$: any;
  posteComptableSeanceOpcvm: Postecomptableseanceopcvm;
  posteComptableSeanceOpcvmTab: Postecomptableseanceopcvm[];

  downloading = false;
  downloaded = false;
  submitting = false;
  seance : any;
  idSeance : number;
  nbreLigne : number;
  idOpcvm: number;
  submitted = false;
  public seanceSettings = {};

  //DataTable Config
  datatableConfig: Config = {};
  datatableConfigVDE: Config = {};
  dtOptions: any = {};
  dtOptionsVDE: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtTriggerVDE: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild(DataTableDirective, {static: false}) datatableElementVDE: DataTableDirective;
  @ViewChild('details', {read: ViewContainerRef}) detailsComponentContainer: ViewContainerRef;
  vde:boolean;
  vna:boolean;
  desactiveBouton:boolean;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private operationService: OperationService,
    private posteComptableSeanceOpcvmService: PostecomptableseanceopcvmService,
    private seanceOpcvmService: SeanceopcvmService,
    private localStore: LocalService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
  }

  ngAfterViewInit(): void {
    if(!this.vde)
      this.dtTrigger.next(null);
    else
      this.dtTriggerVDE.next(null);
    /*this.datatableElement.dtInstance.then(table => {
      console.log(table);
      this.table = table;
    });*/
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      seance: [null],
      dateOperation: [new NgbDate(dateSeance.getFullYear(),dateSeance.getMonth()+1,dateSeance.getDate())],
      sous: this.fb.array([this.createListeForm()]),
    });
    this.seanceSettings = {
      singleSelection: true,
      idField: 'idSeance',
      textField: 'libelleSeance',
      enableCheckAll: false,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.afficherSeance();
    // this.afficherListe()
    // this.afficherListe("l");
  }


  afficherListe() {
    this.submitting=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    this.operationService.etape(5,idOpcvm).subscribe(
      (data)=>{
        if(data.data!=="Vous pouvez passer à l'affichage des écritures") {
          alert("Les étapes suivantes n'ont pas encore été faites:" + data.data)
          this.submitting=false
          return;
        }

        let idSeance = this.idSeance-1
        let dateOperation=new Date()
        if(this.form.controls.dateOperation.value)
        {
          dateOperation = new Date(
            this.form.controls.dateOperation.value.year,
            this.form.controls.dateOperation.value.month-1,
            this.form.controls.dateOperation.value.day+1);
        }
        let param = {
          idOpcvm: idOpcvm,
          idSeance:this.idSeance,
          dateOperation:dateOperation,
          niveau:11
        };

        this.posteComptableSeanceOpcvmService.afficherListe(param).subscribe(
          (data)=>{
            this.posteComptableSeanceOpcvm$=data.data
            console.log(this.posteComptableSeanceOpcvm$)
            const data2 =data.data;

            if (data2 !== undefined && typeof data2 === 'string') {
              const parts = data2.split('.');
              if (parts.length === 2) {
                alert("Les étapes suivantes n'ont pas encore été faites:"+parts[0]);
              }
            }
            this.submitting=false
          }
        )
      }
    )


  }
  get sous(): FormArray {
    return <FormArray>this.form.get('sous');
  }
  ajouterFormControl(elt: any, fieldName: string, fieldValue: any, validators: any[] = []) {
    elt.addControl(fieldName, this.fb.control(fieldValue, validators));
  }
  createListeForm() {
    return this.fb.group({});
  }
  generer() {
    this.vde=false
    this.vna=true
    console.log(this.vde)
    const self = this;
    let columns: any[] = [

      {
        title: 'ID', data: 'idTitre', render: function (data, type, row) {
          return row.titre.idTitre;
        },
      },
      {
        title: 'Symbole.', data: 'symbol', render: function (data, type, row) {
          return row.titre.symbolTitre;
        },
      },
      {
        title: 'VDE COURS.', data: 'valeurVDECours', render: function (data, type, row) {
          return row.valeurVDECours;
        },
      },
      {
        title: 'VDE INTERET', data: 'valeurVDEInteret', render: function (data, type, row) {
          return row.valeurVDEInteret
        },
      }
    ];
    // self.avis.clear();
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        // let idSeance = this.form.value.seance===null?0:this.form.value.seance.idSeance
        let param = {
          idOpcvm: idOpcvm,
          idSeance:this.idSeance-1,
          datatableParameters: dataTablesParameters
        };


        console.log(param);
        const sb = this.operationDifferenceEstimationService.afficherTous(param)
          .subscribe(resp => {
            callback(resp.data);
            console.log(resp.data)
          });
        this.subscriptions.push(sb);

      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {


      }
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
    // this.cdr.detectChanges();
  }
  afficherSeance(){
    this.seanceOpcvmService.listeSeanceOpcvmDesc(this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.seance=data.data
      }
    )
  }
  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    this.idSeance=item.idSeance
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    // this.afficherListe()

  }
  public onDeSelect(item: any) {
    this.idSeance=-1
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    // this.afficherListe()
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
    // this.cdr.detectChanges();
  }
  rerenderVDE(): void {
    try {
      this.datatableElementVDE.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTriggerVDE.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
    // this.cdr.detectChanges();
  }

  actualiser() {
    this.afficherListe();
  }

  ngAfterContentInit(): void {
    console.log("Tr === ", document.querySelector('.detail'));
  }
  save() {
    // return;
    // this.submitting = true;
    this.nbreLigne = document.getElementById("table_codeposte").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    if(this.nbreLigne===1){
      alert("Aucune donnée dans le tableau")
      return
    }
    // this.loadingService.setLoading(true)
    this.submitted=true
    let i: number = 1;
    let dateOperation: any;

    if(this.form.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.form.controls.dateOperation.value.year,
        this.form.controls.dateOperation.value.month-1,
        this.form.controls.dateOperation.value.day+1);
    }
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm").idOpcvm
    //        console.log(this.nbreLigne);
    this.posteComptableSeanceOpcvmTab=[]

    for (i === 1; i < this.nbreLigne; i++) {
      this.posteComptableSeanceOpcvm=new Postecomptableseanceopcvm();
      this.posteComptableSeanceOpcvm.opcvm=this.opcvm
      this.posteComptableSeanceOpcvm.idSeance=this.idSeance
      this.posteComptableSeanceOpcvm.dateValeur =dateOperation;
      this.posteComptableSeanceOpcvm.codePosteComptable=document.getElementById("table_codeposte").getElementsByTagName('tr')[i].cells[0].innerHTML.trim()
      this.posteComptableSeanceOpcvm.plan=new Plan();
      this.posteComptableSeanceOpcvm.plan.codePlan=document.getElementById("table_codeposte").getElementsByTagName('tr')[i].cells[4].innerHTML.trim()

      this.posteComptableSeanceOpcvm.valeur=Number(document.getElementById("table_codeposte").getElementsByTagName('tr')[i].cells[3].innerHTML.trim())
      this.posteComptableSeanceOpcvm.formuleSysteme=(document.getElementById("table_codeposte").getElementsByTagName('tr')[i].cells[2].innerHTML.trim())

      this.posteComptableSeanceOpcvm.userLogin =this.authService.currentUserValue?.username

      // @ts-ignore
      this.posteComptableSeanceOpcvmTab.push(this.posteComptableSeanceOpcvm);
    }
    console.log(this.posteComptableSeanceOpcvmTab)

    this.posteComptableSeanceOpcvmService.creer(this.posteComptableSeanceOpcvmTab)
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

  }
}

