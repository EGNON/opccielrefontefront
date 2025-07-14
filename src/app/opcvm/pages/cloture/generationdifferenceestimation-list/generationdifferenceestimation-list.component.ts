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
import {TitreModel} from "../../../../titresciel/models/titre.model";
import {catchError, finalize} from "rxjs/operators";

@Component({
  selector: 'app-generationdifferenceestimation-list',
  templateUrl: './generationdifferenceestimation-list.component.html',
  styleUrl: './generationdifferenceestimation-list.component.scss'
})
export class GenerationdifferenceestimationListComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;
  listeAvisForm: any

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  downloaded = false;
  submitting = false;
  seance : any;
  idSeance : number;
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
    private operationExtourneVDEService: OperationextournevdeService,
    private operationDifferenceEstimationService: OperationdifferenceestimationService,
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
    this.dtOptions = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
      pagingType: "simple_numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm d-none'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm d-none',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Chargement...',
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
    };
    this.dtOptionsVDE = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
      pagingType: "simple_numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm d-none'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm d-none',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Chargement...',
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
    };
    this.afficherSeance();
    this.afficherListe()
    // this.afficherListe("l");
  }

  afficherNatureOperationListe() {
    this["natureOps$"] = this.natureOpService.afficherTous();
  }

  afficherListe() {
    this.vde=true
    this.vna=false
    const self = this;
    let columns: any[] = [
      {
        title: 'ID', data: 'idTitre', render: function (data, type, row) {
          return row.idTitre;
        },
      },
      {
        title: 'Symbole.', data: 'symbol', render: function (data, type, row) {
          return row.symbolTitre;
        },
      },
      {
        title: 'QTE.', data: 'qteDetenue', render: function (data, type, row) {
          return row.qteDetenue;
        },
      },
      {
        title: 'Cours.', data: 'cours', render: function (data, type, row) {
          return row.cours;
        },
      },
      {
        title: 'Cump T.', data: 'cumpT', render: function (data, type, row) {
          return row.cumpT;
        },
      },
      {
        title: 'Cump reel.', data: 'cumpReel', render: function (data, type, row) {
          return row.cumpReel;
        },
      },
      {
        title: '+/- Value.', data: 'plusOuMoinsValue', render: function (data, type, row) {
          return row.plusOuMoinsValue;
        },
      },
      {
        title: 'NB Jours couru', data: 'nbreJourCourus', render: function (data, type, row) {
          return row.nbreJourCourus;
        },
      },
      {
        title: 'INT courru.', data: 'interetCourus', render: function (data, type, row) {
          return row.interetCourus;
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
      },
      {
        title: 'IRVM', data: 'irvm', render: function (data, type, row) {
          return row.irvm
        },
      },
      {
        title: 'ID OP COURS', data: 'idOpCours', render: function (data, type, row) {
          return row.idOpCours
        },
      },
      {
        title: 'ID OP INTERET', data: 'idOpInteret', render: function (data, type, row) {
          return row.idOpInteret
        },
      }
    ];
    // self.avis.clear();
    this.datatableConfigVDE = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
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
          dateSeance:dateOperation,
          datatableParameters: dataTablesParameters
        };


        console.log(param);
        const sb = this.operationDifferenceEstimationService.precalculDifferenceEstimation(param)
          .subscribe(resp => {
            callback(resp.data);
            // console.log(resp.data.data.length)
            // if(resp.data.data.length==0)
            //   this.desactiveBouton=false
            // else
            //   this.desactiveBouton=true
          });
        this.subscriptions.push(sb);

      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {

        // const opSouscRachatForm = self.createListeForm();
        // let titre = new TitreModel()
        // titre.idTitre=data.idTitre
        // const opSouscRachat: any = {
        //
        //   idSeance: self.currentSeance?.idSeanceOpcvm?.idSeance,
        //   idOpcvm: self.currentOpcvm?.idOpcvm,
        //   opcvm: self.currentOpcvm,
        //   dateOperation: self.currentSeance?.dateFermeture,
        //   titre:titre,
        //   qteDetenue:data.qteDetenue,
        //   cours:data.cours,
        //   cumpT:data.cumpT,
        //   cumpReel:data.cumpReel,
        //   plusOuMoinsValue:data.plusOuMoinsValue,
        //   nbreJourCourus:data.nbreJourCourus,
        //   interetCourus:data.interetCourus,
        //   valeurVDECours:data.valeurVDECours,
        //   valeurVDEInteret:data.valeurVDEInteret,
        //   idOpCours:data.idOpCours,
        //   idOpInteret:data.idOpInteret,
        //   irvm:data.irvm,
        //   userLogin:self.currentUser?.username
        //
        // };
        // for (const key in opSouscRachat) {
        //   let value = opSouscRachat[key];
        //   if(key.includes("date")) {
        //     value = new Date(value);
        //   }
        //   self.ajouterFormControl(opSouscRachatForm, key, value, []);
        // }
        // self.sous.push(opSouscRachatForm);
      }
    };
    this.dtOptionsVDE = {
      ...this.dtOptionsVDE,
      ...this.datatableConfigVDE,
    };
    this.rerenderVDE();
    // this.cdr.detectChanges();
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
    this.afficherListe()

  }
  public onDeSelect(item: any) {
    this.idSeance=-1
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    this.afficherListe()
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
    this.submitted = true;
    // this.loadingService.setLoading(true);

    if (this.form.invalid) {
      this.submitted = false;
      // this.loadingService.setLoading(false);
      return;
    }
    let dateOperation=new Date()
    if(this.form.controls.dateOperation.value)
    {
      dateOperation = new Date(
        this.form.controls.dateOperation.value.year,
        this.form.controls.dateOperation.value.month-1,
        this.form.controls.dateOperation.value.day+1);
    }
    let param = {
      idOpcvm: this.currentOpcvm?.idOpcvm,
      idSeance:this.idSeance,
      dateSeance:dateOperation,
      dateOperation:dateOperation,
      userLogin:this.currentUser?.username
    };
    // console.log(this.form.value.sous)
    this.operationDifferenceEstimationService.enregistrer(param)
      .pipe(
        catchError((err) => {
          this.submitted = false;
          // this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          // this.submitting = false;
          this.submitted = false;
          // this.loadingService.setLoading(false);
           window.location.reload();
        })
      )
      .subscribe(value => {
        alert(value.data)
        // console.log("C'est le résultat === ", value);
      });
  }
}

