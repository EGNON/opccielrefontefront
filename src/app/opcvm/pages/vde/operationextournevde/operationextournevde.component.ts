import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2, ViewChild, ViewContainerRef
} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {Api, Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OperationregulecartsoldeService} from "../../../services/operationregulecartsolde.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import {
  DeleteModalRegulecartsoldeComponent
} from "../../comptabilite/delete-modal-regulecartsolde/delete-modal-regulecartsolde.component";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
// import any = jasmine.any;
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {OperationdifferenceestimationService} from "../../../services/operationdifferenceestimation.service";

@Component({
    selector: 'app-operationextournevde',
    templateUrl: './operationextournevde.component.html',
    styleUrl: './operationextournevde.component.scss',
    standalone: false
})
export class OperationextournevdeComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
    this.datatableConfigVDE = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let idSeance = this.idSeance-1
        let param = {
          idOpcvm: idOpcvm,
          idSeance:this.idSeance,
          datatableParameters: dataTablesParameters
        };


          console.log(param);
          const sb = this.operationExtourneVDEService.afficherTous(param)
            .subscribe(resp => {
              callback(resp.data);
              console.log(resp.data.data.length)
              if(resp.data.data.length==0)
                this.desactiveBouton=false
              else
                this.desactiveBouton=true
            });
          this.subscriptions.push(sb);

      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {


      }
    };
    this.dtOptionsVDE = {
      ...this.dtOptionsVDE,
      ...this.datatableConfigVDE,
    };
    this.rerenderVDE();
    // this.cdr.detectChanges();
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
}
