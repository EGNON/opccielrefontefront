import {
  AfterContentInit,
  AfterViewInit, ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {OperationextournevdeService} from "../../../services/operationextournevde.service";
import {OperationdifferenceestimationService} from "../../../services/operationdifferenceestimation.service";
import {SeanceopcvmService} from "../../../services/seanceopcvm.service";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {Detailprofil} from "../../../models/detailprofil.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-operationextournevde-add-edit',
  templateUrl: './operationextournevde-add-edit.component.html',
  styleUrl: './operationextournevde-add-edit.component.scss'
})
export class OperationextournevdeAddEditComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;
  listeAvisForm: any

  currentOpcvm: any;
  id: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  downloaded = false;
  submitting = false;
  seance : any;
  operationDifferenceEstimation$ : any;
  idSeance : number;
  idOpcvm: number;
  opcvm: Opcvm;
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
    private route: ActivatedRoute,
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
  get f() { return this.form.controls; }
  ngOnInit(): void {
    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.idSeance = this.route.snapshot.params['id'];
    this.idOpcvm = this.localStore.getData("currentOpcvm")?.idOpcvm;
    this.form = this.fb.group({
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate())],

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
    // this.afficherSeance();
    this.generer()
    // this.afficherListe("l");
  }

  afficherNatureOperationListe() {
    this["natureOps$"] = this.natureOpService.afficherTous();
  }


  generer() {



        let idOpcvm = this.currentOpcvm?.idOpcvm;
        // let idSeance = this.form.value.seance===null?0:this.form.value.seance.idSeance
        let param = {
          idOpcvm: idOpcvm,
          idSeance:this.idSeance-1
        };


        console.log(param);
        const sb = this.operationDifferenceEstimationService.afficherListe(idOpcvm,this.idSeance-1)
          .subscribe(
            (data)=>{
              this.operationDifferenceEstimation$=data.data
              console.log(this.operationDifferenceEstimation$)
            }
          );

    // this.cdr.detectChanges();
  }
  afficherSeance(){
    this.seanceOpcvmService.afficherSelonId(this.localStore.getData("currentOpcvm")?.idOpcvm,this.idSeance).subscribe(
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
  onSaveEntity()
  {
    this.downloading=true
    this.tableau = document.getElementById("table_DifferenceEstimation");
    let length = this.tableau.getElementsByTagName('tr').length
    if (length == 1) {
      alert("La liste est vide")
      return;
    }
    this.isLoading = true;
    this.submitted = true;
    // if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/opcvm/vde/generationextourne/liste']);
        })
      )
      .subscribe(
        (data)=>{
          this.downloading=false
          this.generer()
        }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    let dateOperation=new Date()
    if(this.form.value.dateOperation){
      dateOperation=new Date(this.form.value.dateOperation.year, this.form.value.dateOperation.month-1, this.form.value.dateOperation.day+1)
    }
    const entity: any = {
      opcvm:this.opcvm,
      idSeance:this.idSeance,
      dateValeur:dateOperation,
      userLogin: this.authService.currentUserValue?.username
    };
    console.log("act1",entity)
    this.id=null


    return this.id
      ? this.operationDifferenceEstimationService.update(entity)
      : this.operationDifferenceEstimationService.create(entity);
  }


}
