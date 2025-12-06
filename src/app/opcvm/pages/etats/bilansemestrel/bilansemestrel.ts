import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { ExerciceService } from '../../../services/exercice.service';

@Component({
  selector: 'app-bilansemestrel',
  standalone: false,
  templateUrl: './bilansemestrel.html',
  styleUrl: './bilansemestrel.scss'
})
export class Bilansemestrel implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;
  annee:number;

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
   public exerciceSettings = {};
  actionnaireSelectionne: Personne[];  
  exercice$: any;
  exercice: any;
  codePlan:number;
  actionnaire:any;
  libelle:string;
  allData:any;
  dateDebut:any;
  dateFin:any;
 
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private localStore: LocalService,
    public exerciceService: ExerciceService,
    private libService: LibrairiesService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

    this.afficherExercice();
    this.actionnaireSelectionne=[]
    // this.exerciceSettings = {
    //   singleSelection: true,
    //   idField: 'codePlan',
    //   textField: 'codePlan',
    //   enableCheckAll: true,
    //   selectAllText: 'Sélectionnez tous',
    //   unSelectAllText: 'Ne pas tout sélectionné',
    //   allowSearchFilter: true,
    //   limitSelection: -1,
    //   clearSearchFilter: true,
    //   maxHeight: 197,
    //   itemsShowLimit: 3,
    //   searchPlaceholderText: 'Rechercher un élément',
    //   noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
    //   closeDropDownOnSelection: false,
    //   showSelectedItemsAtTop: false,
    //   defaultOpen: false,
    // };
    
  }
  public onItemSelect2(item: any) {
    // console.log('onItemSelect', item);
    let codePlan=item.codePlan;
    this.codePlan=item.plan.codePlan
    this.actionnaire=item.denomination
  }
  public onDeSelect2(item: any) {
    // console.log('onDeSelect', item);
    let codePlan=item.codePlan;
    this.codePlan=0
    this.actionnaire=""; 
  }

  public onSelectAll2(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll2(items: any) {
    // console.log('onDeSelectAll', items);
  }

  public onFilterChange2(item: any) {
    // console.log('onFilterChange', item);
  }
  public onDropDownClose2(item: any) {
    // console.log('onDropDownClose', item);
  }

afficherExercice(){
    this.exerciceService.afficherExercice(this.localStore.getData("currentOpcvm").idOpcvm
    ).subscribe(
      (data)=>{
        this.exercice$=data;
        this.exercice=data;
       console.log("exercice=",data)
      }
    )
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
      // dateFin: [
      //   new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      // ],
      dateEstimation: [
        new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate()), Validators.required
      ],
      exercice2:[]
    });
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
    //this.afficherListeVide("l");
    // this.actualiser();
  }
  initialiserSelonLibelle() {
    throw new Error('Method not implemented.');
  }

  
  exerciceChange(){
    console.log("date",this.form.value.exercice2.codeExercice)
    this.annee = Number(this.form.value.exercice2.codeExercice);
   if (this.form.value.exercice2?.dateDebut) {
      const raw = this.form.value.exercice2.dateDebut;
      const fixed = raw.replace(/(\.\d{2})$/, '$10'); // ajoute un zéro si besoin
      this.dateDebut = new Date(fixed);
    }

    if (this.form.value.exercice2?.dateFin) {
      const raw = this.form.value.exercice2.dateFin;
      const fixed = raw.replace(/(\.\d{2})$/, '$10');
      this.dateFin = new Date(fixed);
    }
    
    //this.afficherListeVide("l");
  }
  telecharger(){
    switch (this.libelle.toLowerCase()) {
      case 'bilan':
        this.etatfinanciertrimestrielbilantrimestriel();
        break;
      case 'compteresultat':
        this.etatfinanciertrimestrielcompteresultat();
        break;
      case 'variationactifnet':
        //this.variationactifnet();
        break;
      case 'noterevenusplacementsmonetaires':
        this.noterevenusplacementsmonetaires();
        break;
      case 'noterevenusportefeuilletitremonetaires':
        this.noterevenusportefeuilletitremonetaires();
        break;
      case 'tableauanalysevl':
        this.tableauanalysevl();
        break;
      case 'montantfraisgestion':
        //this.montantfraisgestion();
        break;
      case 'noteportefeuilletitre':
        this.noteportefeuilletitre();
        break;
      case 'noteportefeuilletitre':
        this.noteportefeuilletitre();
        break;
      case 'noteplacementsmonetaires':
        this.noteplacementsmonetaires();
        break;
      case 'actionsadmisescote':
        this.actionsadmisescote();
        break;
      case 'notesurlecapital':
        this.notesurlecapital();
        break;
      case 'noteetatsfinanciers':
        this.noteetatsfinanciers();
        break;
      case 'etatmensuelsouscription':
        this.etatmensuelsouscription();
        break;
      default:
        console.warn('Libellé inconnu :', this.libelle);
        break;
    }
  }
  etatfinanciertrimestrielbilantrimestriel() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      periodicite:'Semestriel'
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.etatfinanciertrimestrielbilantrimestrielEtat(param)
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
        a.download = 'bilan_Semestriel.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  tableauanalysevl() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      format:"TRIMESTRE",
      periodicite:'Semestriel',
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.tableauanalysevl(param)
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
        a.download = 'tableau_analyse_vl.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  montantfraisgestion() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      format:"TRIMESTRE",
      periodicite:'Semestriel',
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.montantfraisgestion(param)
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
        a.download = 'montant_frais_gestion.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  noteportefeuilletitre() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      // annee:this.annee,
      periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.noteportefeuilletitre(param)
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
        a.download = 'note_portefeuille_titre.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  noteplacementsmonetaires() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      // annee:this.annee,
      periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.noteplacementsmonetaires(param)
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
        a.download = 'notes_placements_monetaires.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  actionsadmisescote() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      // annee:this.annee,
      periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.actionsadmisescote(param)
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
        a.download = 'actions_admises_a_la_cote.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  noteetatsfinanciers() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      // annee:this.annee,
      periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.noteetatsfinanciers(param)
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
        a.download = 'note_etats_financiers.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  etatmensuelsouscription() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      // annee:this.annee,
      periodicite:'Semestriel',
      format:'Semestriel',
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.etatmensuelsouscription(param)
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
        a.download = 'etat_mensuel_souscription.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  notesurlecapital() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      // annee:this.annee,
      periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.notesurlecapital(param)
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
        a.download = 'note_sur_capital.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  noterevenusplacementsmonetaires() {
    // if(this.form.value.exercice==null){
    //   alert("Veuillez choisir un exercice.")
    //   return;
    // }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      exercice:this.annee,
       periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
       dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.noterevenusplacementsmonetaires(param)
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
        a.download = 'note_revenus_placements_monetaires.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  noterevenusportefeuilletitremonetaires() {
   
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      periodicite:'Semestriel',
      // // actionnaire:this.actionnaire,
       dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.noterevenusportefeuilletitremonetaires(param)
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
        a.download = 'notes_reveneus_portefeuille_titre_Semestriel.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  etatfinanciertrimestrielcompteresultat() {
    
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
     // exercice:this.annee,
      // // actionnaire:this.actionnaire,
      periodicite:'Semestriel',
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //dateFin: new Date(this.dateFin.year, this.dateFin.month - 1, this.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.etatfinanciertrimestrielcompteresultat(param)
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
        a.download = 'compte_resultat.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  variationactifnet() {
   
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
       periodicite:'Semestriel',
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.etatfinanciertrimestrielvariationactifnet(param)
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
        a.download = 'variation_actif_net.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}