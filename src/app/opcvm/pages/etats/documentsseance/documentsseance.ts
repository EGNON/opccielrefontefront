import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config, Api } from 'datatables.net';
import saveAs from 'file-saver';
import moment from 'moment';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { JournalService } from '../../../../core/services/journal.service';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { ExerciceService } from '../../../services/exercice.service';
import * as XLSX from "xlsx";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documentsseance',
  standalone: false,
  templateUrl: './documentsseance.html',
  styleUrl: './documentsseance.scss'
})
export class Documentsseance implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
 libelle:string;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;
  dateDebut:any;
  dateFin:any;
  annee:number;
  idOperationTab:any[]
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
   public journalSettings = {};
  actionnaireSelectionne: Personne[];  
  exercice$: any;
  exercice: any;
  journal: any;
  codeJournal:any;
  actionnaire:any;
  historiqueVL$:any;

  allData:any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public journalService: JournalService,
     private route: ActivatedRoute,
    private libService: LibrairiesService,
    private exerciceService: ExerciceService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

   
   
    
  }
 
 
  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    const dateFin = new Date(this.currentSeance?.dateFermeture);
    this.route.paramMap.subscribe(params => {
      this.libelle = params.get('libelle') ?? '';
    });
    this.form = this.fb.group({
      dateFin: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      dateDebut: [
       new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate()), Validators.required
      ],
    });
    this.idOperationTab=[]
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
    this.actualiser();
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
     
      {
        title: 'ID', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation
        },
      },
      {
        title: 'DATE OPERATION', data: 'dateOperation', render: function (data, type, row) {
          return moment(row.dateOperation).format("DD/MM/YYYY")
        },
      },
      {
        title: 'DEMANDEUR', data: 'demandeur', render: function (data, type, row) {
          return row.demandeur;
        },
      },
      {
        title: 'QTE INITIALE', data: 'qteInitialeD', render: function (data, type, row) {
          return row.qteInitialeD;
        },
      },
      {
        title: 'CUMP', data: 'cumpEntre', render: function (data, type, row) {
          return row.cumpEntre;
        },
      },
      {
        title: 'BENEFICIAIRE', data: 'beneficiaire', render: function (data, type, row) {
          return row.beneficiaire;
        },
      },
      {
        title: 'QTE INITIALE', data: 'qteInitialeB', render: function (data, type, row) {
          return row.qteInitialeB;
        },
      },
      {
        title: 'QTE TRANSFERT', data: 'qteTransfert', render: function (data, type, row) {
          return row.qteTransfert;
        },
      },

    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            dateOuverture: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFermeture: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          console.log(param);
          const sb = this.libService.operationTransfertPart(param)
            .subscribe(resp => {
              console.log("Retour releve === ", resp.data);
              callback(resp.data);
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
      // drawCallback: function(settings) {
      //   // @ts-ignore
      //   let api = this.api();
      //   let rows = api.rows({ page: 'current' }).nodes();
      //   let last = null;

      //   api.column(0, { page: 'current' }).data().each(function(group, i) {
      //     if (last !== group) {
      //       $(rows).eq(i).before(
      //         `<tr class="group"><td colspan="${api.columns().count()}"><b>${group}</b></td></tr>`
      //       );
      //       last = group;
      //     }
      //   });
      // },
      createdRow: function (row, data: any, dataIndex) {},
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
   
  }
  onTableDataChange(event: any) {
    this.page = event;
    // this.afficherActionnaire();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // this.afficherActionnaire();
  }
  
  verif_souscription(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let param = {
        idOpcvm: idOpcvm,
        idSeance:data.idSeance,
        codeNatureOperation:'DEP_SOUS',
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_SouscriptionEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_souscriptions.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
  verif_rachat(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let param = {
        idOpcvm: idOpcvm,
        idSeance:data.idSeance,
        codeNatureOperation:'INT_RACH',
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_RachatEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_rachats.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
  verif_vde(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let param = {
        idOpcvm: idOpcvm,
        idSeance:data.idSeance,
        supprimer:false,
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_vdeEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_vde.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
    verif_code_poste(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let param = {
        idOpcvm: idOpcvm,
        idSeance:data.idSeance+1,
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_codePosteEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_code_poste.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
  verif_charge(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let param = {
        idOpcvm: idOpcvm,
        idSeance:data.idSeance,
        supprimer:false,
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_chargeEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_charges.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
  verif_ecriture(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let dateFermeture=new Date(data.dateFermetureSeance)
      console.log(dateFermeture)
      let param = {
        idOpcvm: idOpcvm,
        dateDebut:new Date(dateFermeture.getFullYear(), dateFermeture.getMonth(),dateFermeture.getDate()+1),
        dateFin:new Date(dateFermeture.getFullYear(), dateFermeture.getMonth(),dateFermeture.getDate()+1),
        codeTypeOperation:null,
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_EcritureEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_ecritures.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
  verif_ecriture_vde(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let dateFermeture=new Date(data.dateFermetureSeance)
      console.log(dateFermeture)
      let param = {
        idOpcvm: idOpcvm,
        dateDebut:new Date(dateFermeture.getFullYear(), dateFermeture.getMonth(),dateFermeture.getDate()+1),
        dateFin:new Date(dateFermeture.getFullYear(), dateFermeture.getMonth(),dateFermeture.getDate()+1),
        codeTypeOperation:"DE",
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_Ecriture_VDEEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_ecritures_vde.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
  verif_ecriture_charge(data:any) {
      // if(this.form.value.exercice==null){
      //   alert("Veuillez choisir un exercice.")
      //   return;
      // }
      this.downloading = true;
      const formValue = this.form.value;
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      let dateFermeture=new Date(data.dateFermetureSeance)
      console.log(dateFermeture)
      let param = {
        idOpcvm: idOpcvm,
        dateDebut:new Date(dateFermeture.getFullYear(), dateFermeture.getMonth(),dateFermeture.getDate()+1),
        dateFin:new Date(dateFermeture.getFullYear(), dateFermeture.getMonth(),dateFermeture.getDate()+1),
        codeTypeOperation:"CHARGE",
        niveau1:true,
        niveau2:true
      };
     
      //.subscribe
      console.log(param);
      const sb = this.libService.liste_verif_Ecriture_CHARGEEtat(param)
        .pipe(
          catchError((err) => {
            this.downloading = false;
            return of(err.message);
          }),
          finalize(() => {
            this.downloading = false;
            this.downloaded = false;
          })
        )
         .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'liste_des_verifications_des_ecritures_charge.pdf';
          a.click();
        });
      this.subscriptions.push(sb);
    }
telechargerDocuments(data:any){
    switch (this.libelle.toLowerCase()) {
      case 'verif_souscription':
        this.verif_souscription(data);
        break;
      case 'verif_rachat':
        this.verif_rachat(data);
        break;
      case 'verif_ecriture':
        this.verif_ecriture(data);
        break;
      case 'verif_vde':
        this.verif_vde(data);
        break;
      case 'verif_ecriture_vde':
        this.verif_ecriture_vde(data);
        break;
      case 'verif_charge':
        this.verif_charge(data);
        break;
      case 'verif_ecriture_charge':
        this.verif_ecriture_charge(data);
        break;
      case 'verif_code_poste':
        this.verif_code_poste(data);
        break;
      default:
        console.warn('Libellé inconnu :', this.libelle);
        break;
    }
  }
  actualiser() {
    let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idActionnaire:this.codeJournal,
          idOpcvm: idOpcvm,
          ...this.form.value,
        
        };
       
          param = {
            ...param,
            dateDebut:null,
            dateFin:null
          };
          console.log(param);
          const sb = this.libService.historiqueVL(param)
            .subscribe(resp => {
              console.log("Retour releve === ", resp.data);
              this.historiqueVL$=resp.data
            });
          this.subscriptions.push(sb);
        
  }

  telecharger() {
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      idOp:this.idOperationTab,
      dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    const sb = this.libService.avistransfertpartEtat(param)
      .pipe(
        catchError((err) => {
          this.downloading = false;
          return of(err.message);
        }),
        finalize(() => {
          this.downloading = false;
          this.downloaded = false;
        })
      )
     .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'avis_transfert_part.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
