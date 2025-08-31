import {
  AfterContentInit,
  AfterViewInit, ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {LocalService} from "../../../../services/local.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {TypeoperationService} from "../../../../core/services/typeoperation.service";
import {OperationService} from "../../../services/operation.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {catchError, finalize} from "rxjs/operators";
import moment from "moment";
import {Typeoperation} from "../../../../core/models/typeoperation.model";
import $ from "jquery";

@Component({
    selector: 'app-verificationecritureniveau2de',
    templateUrl: './verificationecritureniveau2de.component.html',
    styleUrl: './verificationecritureniveau2de.component.scss',
    standalone: false
})
export class Verificationecritureniveau2deComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;
  listeAvisForm: any
  typeOperation$:any;
  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
  verificationNiveau$:any;
  operation$:any;
  downloading = false;
  downloaded = false;
  submitting = false;
  verification = false;
  verifierEtape = false;
  valider = false;
  liste = false;
  submitted = false;
  confirmerGrise:boolean;
  apercuGrise:boolean;
  verifierGrise:boolean;
  verifierGriseAfficher:boolean;
  idOperation:any[];
  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild('details', {read: ViewContainerRef}) detailsComponentContainer: ViewContainerRef;
  @ViewChild('mySelect') mySelect!: ElementRef<HTMLSelectElement>;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    private pageInfo: PageInfoService,
    private typeOperationService: TypeoperationService,
    private operationService: OperationService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
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
      idSeance: [this.currentSeance?.idSeanceOpcvm?.idSeance],
      idOperation: [0, Validators.required],
      idTransaction: [0, Validators.required],
      typeOperation: [null],
      operation: [null],
      verif1: [null],
      dateDebut: [
        new NgbDate(dateOuv.getFullYear(), dateOuv.getMonth()+1, dateOuv.getDate()), Validators.required
      ],
      dateFin: [
        new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()), Validators.required
      ]
    });
    this.idOperation=[]
    this.confirmerGrise=true
    this.apercuGrise=true
    this.verifierGrise=true
    this.verifierGriseAfficher=true
    this.submitting=false
    this.downloading=false
    this.verifierEtape=false
    this.liste=false
    this.pageInfo.updateTitle("Vérification écritures DE niveau 2");
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
    this.afficherNatureOperationListe();
    // this.afficherListe("l");
  }

  afficherNatureOperationListe() {
    this.typeOperationService.afficherTous().subscribe(
      (data)=>{
        this.typeOperation$=data.data
      }
    );
  }
  verificationEcritureNiveau1De(){
    this.verifierEtape=true
    this.operationService.etape(5,
      this.localStore.getData("currentOpcvm")?.idOpcvm)
      .pipe(
        catchError((err) => {
          this.submitted = false;
          // this.loadingService.setLoading(false);
          return of(err.message);
        }),
        finalize(() => {
          // this.submitting = false;
          // this.submitted = false;
          // this.loadingService.setLoading(false);
          // window.location.reload();
          this.verifierEtape=false
        })
      ).subscribe(
      (data)=>{
        if (data.data === "Vous pouvez passer à l'affichage des écritures")
        {
          this.verifierGriseAfficher=false

        }
        else
          this.verifierGriseAfficher=true

        alert(data.data);
        // this.downloading=false;
      }
    )
  }
  verificationNiveau1() {
    this.verification=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value
    };
    let estVerifie2:boolean=false;
    if(this.form.value.verif1==="OUI")
    {
      estVerifie2=true
    }
    param = {
      ...param,
      dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
      estVerifie1:true,
      estVerifie2:estVerifie2,
      idSeance:0,
      codeTypeOperation:"DE"
    };
    this.operationService.afficherListeVerificationEritureNiveau2(param,"DE").subscribe(
      (data)=>{
        this.verificationNiveau$=data.data
        console.log(this.verificationNiveau$)
        this.verification=false
        if(this.verificationNiveau$!=="")
          alert(this.verificationNiveau$)
        else
          alert("veuillez passer à la vérification niveau2")
      }
    );
  }
  apercu() {
    this.downloading=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value
    };
    let estVerifie2:boolean=false;
    if(this.form.value.verif1==="OUI")
    {
      estVerifie2=true
    }
    param = {
      ...param,
      dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
      estVerifie1:true,
      estVerifie2:estVerifie2,
      idSeance:0,
      codeTypeOperation:"DE"
    };
    console.log(param)
    this.operationService.apercuVerificationEritureNiveau(param,2,"DE").subscribe(
      (data)=>{
        console.log(data.data)

        console.log(this.downloading)
        // this.verificationNiveau$=data.data
      }
    );
    this.downloading=false
  }
  validationEcritureNiveau1(){
    this.valider=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value
    };
    let estVerifie2:boolean=false;
    if(this.form.value.verif1==="OUI")
    {
      estVerifie2=true
    }

    param = {
      ...param,
      dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
      estVerifie1: true,
      idSeance:0,
      estVerifie2: estVerifie2
    }
    console.log(param);
    console.log(this.form.value);
    const options = this.mySelect.nativeElement.options;
    console.log("option=",options)
    for (let i = 0; i < options.length; i++) {
      this.idOperation.push(options[i].innerHTML)
      // console.log(options[i].value, options[i].text);
    }
    console.log("idoperation=",this.idOperation)

    this.operationService.validationEcritureNiveau2(this.idOperation,
      this.authService.currentUserValue?.username,"DE",null,this.currentOpcvm?.idOpcvm).subscribe(
      (data)=>{
        console.log("reponse=",data.data)
        this.valider=false
        alert("Validation des écritures effectuée avec succès")
      }
    )
    // const sb = this.operationService.afficherListeVerificationEritureListe(param)
    //   .subscribe(resp => {
    //     console.log("resp=",resp.data)
    //
    //   });

  }
  afficherListe(prefix: string) {
    if(this.liste)
      this.submitting=true

    this.liste=true
    const self = this;
    let columns: any[] = [
      {
        sortable: false,
        title: ``,
        class: 'row-details cursor-pointer text-center min-w-10px',
        render: (data: any, type: any, full: any) => {
          return `<i class="fa fa-plus"></i>`;
        },
      },
      {
        title: 'ID OP.', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation;
        },
      },
      {
        title: 'ID TRANS.', data: 'idTransaction', render: function (data, type, row) {
          return row.idTransaction;
        },
      },
      {
        title: 'DATE OP.', data: 'dateOperation', render: function (data, type, row) {
          return moment(data).format('DD MMM YYYY à HH:mm:ss');
        },
      },
      {
        title: 'DATE VALEUR', data: 'dateValeur', render: function (data, type, row) {
          return moment(data).format('DD MMM YYYY à HH:mm:ss');
        },
      },
      {
        title: 'OPERATION', data: 'libelleOperation', render: function (data, type, row) {
          return row.libelleOperation || '';
        },
      }
    ];
    // self.avis.clear();
    // this.submitting=true
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
        let param = {
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        let estVerifie2:boolean=false;
        if(this.form.value.verif1==="OUI")
        {
          estVerifie2=true
        }
        let typeOperationDto=new Typeoperation();
        typeOperationDto.codeTypeOperation="DE"
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            idSeance:0,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
            estVerifie1:true,
            estVerifie2:estVerifie2,
            typeOperationDto:typeOperationDto
          };
          console.log(param);

          const sb = this.operationService.afficherListeVerificationEriture(param)
            .subscribe(resp => {
              callback(resp.data);
              // this.operation$=resp.data

              console.log(resp.data)
              if(resp.data.length==0 && this.form.value.verif1==="NON"){
                this.confirmerGrise=true
                this.apercuGrise=true
                this.verifierGrise=true
              }
              else if(resp.data.length!==0 )
              {
                if(this.form.value.verif1==="NON")
                {
                  this.confirmerGrise=false
                  this.apercuGrise=false
                  this.verifierGrise=false
                }
                else
                {
                  this.confirmerGrise=true
                  this.apercuGrise=true
                  this.verifierGrise=true
                }
              }
            });
          this.operationService.afficherListeVerificationEritureListe(param)
            .subscribe(resp => {
              this.operation$=resp.data
              console.log("operation=",this.operation$)
              this.submitting=false
            });
          this.subscriptions.push(sb);
        }
        else {
          callback({
            draw: dataTablesParameters.draw,
            recordsTotal: 1,
            recordsFiltered: 1,
            data: []
          });
        }
      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {
        $(row).find('.row-details').on('click', (e) => {
          const existedTr = $(row).next();
          if(!(existedTr.attr("id") && existedTr.attr("id") == `detail-${data.idOperation}`)) {
            self.operationService.afficherDetailsEcriture(data.idOperation).subscribe(resp => {
              //Changer l'icône du boutton
              $(row).find("td:first").html("<i class='fa fa-minus'></i>");
              const a = self.operationService.appendDialogComponentToBody(resp.data, data.idOperation);
              const newTr = a.querySelector(`#detail-${data.idOperation}`);
              newTr.classList.add("active");
              newTr.querySelectorAll(".cell-total").forEach((value, key, parent) => {
                /*self.renderer.setStyle(value.parentElement,'backgroundColor', 'blue');
                self.renderer.setStyle(value.parentElement,'color', 'white');
                self.renderer.setStyle(value.parentElement,'fontWeight', 'bold');*/
                value.setAttribute("style", "color: white;");
                value.parentElement.setAttribute("style", "background-color:darkblue; font-weight: bold;");
              });
              $(row).after(newTr);
            });
          }
          else {
            console.log("Liste classe === ", existedTr.attr("class"));
            if(existedTr.attr("class").includes("active")) {
              $(row).find("td:first").html("<i class='fa fa-plus'></i>");
              existedTr.removeClass("active");
              existedTr.hide();
            }
            else {
              $(row).find("td:first").html("<i class='fa fa-minus'></i>");
              existedTr.addClass("active");
              existedTr.show();
            }

          }
          // self.submitting=false
          /*//Générer le composant Detail en passant le paramètre idOperation
          const componentRef = self.operationService.afficherComposantDetails(self.detailsComponentContainer, data.idOperation);
          //Récupérer l'élément detail dans la constante tableDetail
          const tableDetail = (componentRef.instance as DetailsEcritureComponent).detail?.nativeElement;
          // console.log($(row).parents('.table').find(`#detail-${data.idOperation}`));
          $(tableDetail).remove();
          //Ajouter cet élément au tableau après la ligne concernée
          $(row).after(tableDetail);
          const a = self.operationService.appendDialogComponentToBody(data.idOperation);
          console.log("Html View === ", a);*/

        });
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
    // this.cdr.detectChanges();
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

  actualiser() {
    // if(this.form.value.verif1==="NON")
    //   this.confirmerGrise=false
    // else
    //   this.confirmerGrise=true
    this.confirmerGrise=true
    this.apercuGrise=true
    this.verifierGrise=true
    this.afficherListe("l");
  }

  ngAfterContentInit(): void {
    console.log("Tr === ", document.querySelector('.detail'));
  }
}
