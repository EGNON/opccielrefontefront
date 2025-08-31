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
import moment from "moment";
import {OperationChargeEtalerService} from "../../../services/operation-charge-etaler.service";
import {Opcvm} from "../../../../core/models/opcvm";
import {Operationchargeaetaler} from "../../../models/operationchargeaetaler.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-amortissementcharge',
    templateUrl: './amortissementcharge.component.html',
    styleUrl: './amortissementcharge.component.scss',
    standalone: false
})
export class AmortissementchargeComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;
  listeAvisForm: any

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  downloaded = false;
  submitting = false;
  verifier = false;
  seance : any;
  idSeance : number;
  idOpcvm: number;
  opcvm: Opcvm;
  nbreLigne: number;
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
  boutonEnregistrerGrise:boolean;
  desactiveBouton:boolean;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  operationChargeAEtalers:Operationchargeaetaler[];
  operationChargeAEtaler:Operationchargeaetaler;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private operationExtourneVDEService: OperationextournevdeService,
    private operationChargeAEtalerService: OperationChargeEtalerService,
    private seanceOpcvmService: SeanceopcvmService,
    private localStore: LocalService,
    private router: Router,
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
    this.idSeance=-1
    this.generer()
    this.boutonEnregistrerGrise=true
    // this.afficherListe("l");
  }



  afficherListe() {
    this.vde=true
    this.vna=false
    const self = this;
    let columns: any[] = [
      {
        title: 'ID', data: 'idOperation', render: function (data, type, row) {
          return row?.idOperation;
        },
      },
      {
        title: 'Date opération.', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format('DD/MM/YYYY');
        },
      },
      {
        title: 'Charge.', data: 'designation', render: function (data, type, row) {
          return row.designation;
        },
      },
      {
        title: 'Type charge.', data: 'typeCharge', render: function (data, type, row) {
          return row.typeCharge;
        },
      },
      {
        title: 'MT/Taux global.', data: 'montantTaux', render: function (data, type, row) {
          return row.montantTaux;
        },
      },
      {
        title: 'Actif brut.', data: 'actifBrut', render: function (data, type, row) {
          return row.actifBrut;
        },
      },
      {
        title: 'NB Jours', data: 'nbreJour', render: function (data, type, row) {
          return row.nbreJour;
        },
      },
      {
        title: 'Usance.', data: 'usance', render: function (data, type, row) {
          return row.usance;
        },
      },
      {
        title: 'Modele.', data: 'codeModele', render: function (data, type, row) {
          return row.codeModele;
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
          dateOperation:dateOperation,
          datatableParameters: dataTablesParameters
        };

        console.log(param);
        const sb = this.operationChargeAEtalerService.afficherTous(param)
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
    this.vde=true
    this.vna=false
    this.submitting=true
    const self = this;
    let columns: any[] = [
      {
        title: 'ID', data: 'idOperation', render: function (data, type, row) {
          return row?.idOperation;
        },
      },
      {
        title: 'Date opération.', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format('DD/MM/YYYY');
        },
      },
      {
        title: 'Charge.', data: 'designation', render: function (data, type, row) {
          return row.designation;
        },
      },
      {
        title: 'Type charge.', data: 'typeCharge', render: function (data, type, row) {
          return row.typeCharge;
        },
      },
      {
        title: 'MT/Taux global.', data: 'montantTaux', render: function (data, type, row) {
          return row.montantTaux;
        },
      },
      {
        title: 'Actif brut.', data: 'actifBrut', render: function (data, type, row) {
          return row.actifBrut;
        },
      },
      {
        title: 'NB Jours', data: 'nbreJour', render: function (data, type, row) {
          return row.nbreJour;
        },
      },
      {
        title: 'Usance.', data: 'usance', render: function (data, type, row) {
          return row.usance;
        },
      },
      {
        title: 'Modele.', data: 'codeModele', render: function (data, type, row) {
          return row.codeModele;
        },
      },
      {
        title: 'Montant.', data: 'montantCharge', render: function (data, type, row) {
          return row.montantCharge;
        },
      },
      {
        title: 'Code charge.', data: 'codeCharge', render: function (data, type, row) {
          return row.codeCharge;
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
          dateOperation:dateOperation,
          datatableParameters: dataTablesParameters,
          niveau:6
        };

        console.log(param);
        const sb = this.operationChargeAEtalerService.afficherTous(param)
          .subscribe(resp => {
            console.log("resp=",resp.data.data)
            if(resp.data.data.length!=0)
            {
              this.boutonEnregistrerGrise=true
              this.submitting=false
              callback(resp.data);
            }
            else {
              this.boutonEnregistrerGrise=false
              this.submitting=true
              this.operationChargeAEtalerService.precalcul(param).subscribe(
                resp2 => {
                  console.log("resp2=", resp2.data)
                  callback(resp2.data)
                  const data = resp2.data.data;

                  if (data !== undefined && typeof data === 'string') {
                    const parts = data.split('.');
                    if (parts.length === 2) {
                      alert("Les étapes suivantes n'ont pas encore été faites:"+parts[0]);
                    }
                  }

                  this.submitting=false
                }
              )
            }
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

      }
    };
    this.dtOptionsVDE = {
      ...this.dtOptionsVDE,
      ...this.datatableConfigVDE,
    };
    this.rerenderVDE();
  }
  afficherSeance(){
    this.seanceOpcvmService.listeSeanceOpcvmDesc(this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.seance=data.data
      }
    )
  }
  verifierChargeAEtaler(){
    console.log("pass")
    this.downloading=true
    this.operationChargeAEtalerService.verifier(this.idSeance,
      this.localStore.getData("currentOpcvm")?.idOpcvm)
      .pipe(
        catchError((err) => {
          this.downloading = false;
          // this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          // this.submitting = false;
          // this.submitted = false;
          // this.loadingService.setLoading(false);
          // window.location.reload();
          this.downloading=false
        })
      ).subscribe(
      (data)=>{

        // this.downloading=false;
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
    // this.generer()

  }
  public onDeSelect(item: any) {
    this.idSeance=-1
    this.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm
    // this.afficherListe()
    // this.generer()
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
    this.nbreLigne = document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
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
    this.operationChargeAEtalers=[]

    for (i === 1; i < this.nbreLigne; i++) {
      this.operationChargeAEtaler=new Operationchargeaetaler();
      this.operationChargeAEtaler.referencePiece = "";
      // @ts-ignore
      // this.operationChargeAEtaler.idActionnaire=0

      this.operationChargeAEtaler.opcvm=this.opcvm
      this.operationChargeAEtaler.idSeance=this.idSeance
      this.operationChargeAEtaler.dateOperation =dateOperation;
      this.operationChargeAEtaler.codeModele=document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[8].innerHTML.trim()
      this.operationChargeAEtaler.designation=document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[2].innerHTML.trim()
      this.operationChargeAEtaler.datePiece = dateOperation;
      // this.operationChargeAEtaler.dateSaisie =new Date();
      this.operationChargeAEtaler.montant=Number(document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[9].innerHTML.trim())
      this.operationChargeAEtaler.usance=Number(document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[7].innerHTML.trim())
      this.operationChargeAEtaler.nbreJour=Number(document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[6].innerHTML.trim())
      this.operationChargeAEtaler.actifBrut=Number(document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[5].innerHTML.trim())
      this.operationChargeAEtaler.typeCharge=(document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[3].innerHTML.trim())
      this.operationChargeAEtaler.codeCharge=(document.getElementById("table_Charge_A_Etaler").getElementsByTagName('tr')[i].cells[10].innerHTML.trim())
      this.operationChargeAEtaler.dateValeur =dateOperation;
      this.operationChargeAEtaler.idOperation = 0;
      this.operationChargeAEtaler.idTransaction = 0;

      this.operationChargeAEtaler.userLogin =this.authService.currentUserValue?.username

      // @ts-ignore
      this.operationChargeAEtalers.push(this.operationChargeAEtaler);
    }
    console.log(this.operationChargeAEtalers)
    // return;
    this.operationChargeAEtalerService.creer(this.operationChargeAEtalers)
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
    // let dateOperation=new Date()
    // if(this.form.controls.dateOperation.value)
    // {
    //   dateOperation = new Date(
    //     this.form.controls.dateOperation.value.year,
    //     this.form.controls.dateOperation.value.month-1,
    //     this.form.controls.dateOperation.value.day+1);
    // }
    // let param = {
    //   idOpcvm: this.currentOpcvm?.idOpcvm,
    //   idSeance:this.idSeance,
    //   dateOperation:dateOperation,
    //   userLogin:this.currentUser?.username
    //
    // };
    // // console.log(this.form.value.sous)
    // this.operationDifferenceEstimationService.enregistrer(param)
    //   .pipe(
    //     catchError((err) => {
    //       this.submitted = false;
    //       // this.loadingService.setLoading(false);
    //       return of(err.message);
    //     }),
    //     finalize(() => {
    //       // this.submitting = false;
    //       this.submitted = false;
    //       // this.loadingService.setLoading(false);
    //       window.location.reload();
    //     })
    //   )
    //   .subscribe(value => {
    //     alert(value.data)
    //     // console.log("C'est le résultat === ", value);
    //   });
  }
}

