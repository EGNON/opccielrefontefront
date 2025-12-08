import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import saveAs from 'file-saver';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { ExerciceService } from '../../../../opcvm/services/exercice.service';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { AuthService } from '../../../modules/auth';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-portefeuilleactionnaire-annee',
  standalone: false,
  templateUrl: './portefeuilleactionnaire-annee.html',
  styleUrl: './portefeuilleactionnaire-annee.scss'
})
export class PortefeuilleactionnaireAnnee implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;
  idActionnaireTab:any[]
  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  export = false;
  downloaded = false;
  submitting = false;
  submitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  private clickListener: () => void;
  private idInAction: number;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  allData:any;
  actionnaire$:any;
  dateDebut:Date;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    private libService: LibrairiesService,
    private router: Router,
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    // this.exerciceService.afficherExerciceCourant(this.currentOpcvm?.idOpcvm).subscribe(
    //   (data)=>{
    //     if(data.data.length==0)
    //       this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    //     else
    //       this.dateDebut=new Date(data.data.dateDebut);
    //   }
    // )
  }

  ngAfterContentInit(): void {
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date();
    const dateFin = new Date();
    this.form = this.fb.group({
      endDate: [
        new NgbDate(dateFin.getFullYear(), dateFin.getMonth()+1, dateFin.getDate()), Validators.required
      ],
      startDate: [
        new NgbDate(this.dateDebut.getFullYear(), this.dateDebut.getMonth()+1, this.dateDebut.getDate()), Validators.required
      ],
      search:[null]
    });
    this.idActionnaireTab=[];
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
    this.afficherActionnaire();
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.afficherActionnaire();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.afficherActionnaire();
  }
  afficherActionnaire(){
    this.libService.afficherPersonnePhysiqueMorale().subscribe(
      (data)=>{
        this.actionnaire$=data.data
      }
    )
  }
  rechercherActionnaire(){
    let valeur=this.form.value.search
    if(valeur!==undefined && valeur!==null)
    this.libService.rechercherPersonnePhysiqueMorale(valeur).subscribe(
      (data)=>{
        this.actionnaire$=data.data
      }
    )
  }
  
  getIdActionnaire(isSelected, idActionnaire){
    console.log(isSelected, idActionnaire)

    if(isSelected==true) {
      let index=this.idActionnaireTab.indexOf(idActionnaire)
      if(index===-1)
        this.idActionnaireTab.push(idActionnaire)
    }
    else
    {
      let index=this.idActionnaireTab.indexOf(idActionnaire)
      if(index!==-1)
        this.idActionnaireTab.splice(index,1)
    }
    console.log(this.idActionnaireTab)
  }
  
  exportExcel() {
    this.export=true
    // 1️⃣ Définir les entêtes
    const headers = ['ID','N°COMPTE SGI','NOM / SIGLE','PRENOMS / RAISON SOCIALE','STATUT'];
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      dateDebut: new Date(param.startDate.year, param.startDate.month - 1, param.startDate.day + 1),
      dateFin: new Date(param.endDate.year, param.endDate.month - 1, param.endDate.day + 1),
    }
    this.libService.afficherPersonnePhysiqueMorale().subscribe(
      (dataN)=>{
        this.allData=dataN.data;
        const exportData = this.allData.map(item => ({
          'ID': item.idPersonne,
          'N°COMPTE SGI':item.numCompteDepositaire,
          'NOM / SIGLE': item.nomSigle,
          'PRENOMS / RAISON SOCIALE': item.prenomRaison,
          'STATUT': item.statutCompte,
        }));

        // 3️⃣ Convertir en feuille Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        // 4️⃣ Créer le classeur
        const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };

        // 5️⃣ Exporter
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'actionnaires.xlsx');
        this.export=false
      }
    )
    // 2️⃣ Mapper les données avec les entêtes

  }

  actualiser() {
    // this.afficherListe("l");
    this.afficherActionnaire()
  }

  telecharger() {
    this.downloading = true;
    let i=0
    let idActionnaire=""
    for(i===0;i<this.idActionnaireTab.length;i++){
      if(i===0)
        idActionnaire=this.idActionnaireTab[i]
      else
        idActionnaire=this.idActionnaireTab[i]+";"+idActionnaire
    }
    const formValue = this.form.value;
   // let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
     // idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      idActionnaire:idActionnaire,
      dateDebutEstimation: new Date(param.startDate.year, param.startDate.month - 1, param.startDate.day + 1),
      dateEstimation: new Date(param.endDate.year, param.endDate.month - 1, param.endDate.day + 1),
    }
    console.log(param)
    //.subscribe
    const sb = this.libService.portefeuilleActionnaireAnnee(param)
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
        a.download = 'portefeuille_actionnaire_Fin_Annee.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }
 toutDecocher(){
  document.location.reload();
 }
  ngAfterViewInit(): void {
  
  }
}
