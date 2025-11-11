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
  selector: 'app-bilanannuelf2',
  standalone: false,
  templateUrl: './bilanannuelf2.html',
  styleUrl: './bilanannuelf2.scss'
})
export class Bilanannuelf2 implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
  dateDebut:Date;
 
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
      exercice:[]
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
    console.log("date",this.form.value.exercice.codeExercice)
    this.annee = Number(this.form.value.exercice.codeExercice);
   
    //this.afficherListeVide("l");
  }
  telecharger(){
    switch (this.libelle.toLowerCase()) {
      case 'bilanannuelf2':
        this.bilanAnnuelF2();
        break;
      case 'resultatannuelf2':
        this.resultatAnnuelF2();
        break;
      case 'etatvariationactifnetannuelf2':
        this.etatvariationactifnetannuelf2();
        break;
      case 'notesrevenusportefeuilletitreannuelf2':
        this.notesrevenusportefeuilletitreannuelf2();
        break;
      case 'notesrevenusplacementmonetaireannuelf2':
        this.notesrevenusplacementmonetaireannuelf2();
        break;
      case 'notessommesdistribuablesannuelf2':
        this.notessommesdistribuablesannuelf2();
        break;
      case 'donneesratiosannuelf2':
        this.donneesratiosannuelf2();
        break;
      case 'engagementhorsbilanannuelf1':
        this.engagementhorsbilanannuelf1();
        break;
      default:
        console.warn('Libellé inconnu :', this.libelle);
        break;
    }
  }
  bilanAnnuelF2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
     }
    //.subscribe
    console.log(param);
    const sb = this.libService.bilanAnnuelF2Etat(param)
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
        a.download = 'bilan_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  notessommesdistribuablesannuelf2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.notessommesdistribuablesannuelf2Etat(param)
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
        a.download = 'notes_sommes_distribuables_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  donneesratiosannuelf2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.donneesratiosannuelf1Etat(param)
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
        a.download = 'donnees_actions_ratios_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  engagementhorsbilanannuelf1() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
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
      // // actionnaire:this.actionnaire,
      dateEstimation: new Date(param.dateEstimation.year, param.dateEstimation.month - 1, param.dateEstimation.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.engagementhorsbilanannuelf1Etat(param)
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
        a.download = 'engagement_hors_bilan_Annuel_F1.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  notesrevenusportefeuilletitreannuelf2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.notesrevenusportefeuilletitreannuelf2Etat(param)
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
        a.download = 'notes_revenus_portefeuille_titre_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  notesrevenusplacementmonetaireannuelf2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.notesrevenusplacementmonetaireannuelf2Etat(param)
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
        a.download = 'notes_revenus_placements_monetaires_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  resultatAnnuelF2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.resultatAnnuelF2Etat(param)
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
        a.download = 'resultat_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
  etatvariationactifnetannuelf2() {
    if(this.form.value.exercice==null){
      alert("Veuillez choisir un exercice.")
      return;
    }
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      annee:this.annee,
      // // actionnaire:this.actionnaire,
      // dateDebut: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      //  dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    console.log(param);
    const sb = this.libService.etatvariationactifnetannuelf2Etat(param)
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
        a.download = 'etat_variation_actif_net_Annuel_F2.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
}
