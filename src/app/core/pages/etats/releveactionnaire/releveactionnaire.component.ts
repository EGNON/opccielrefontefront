import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../modules/auth";
import {LocalService} from "../../../../services/local.service";
import {LibrairiesService} from "../../../../services/librairies.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ExerciceService} from "../../../../opcvm/services/exercice.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {catchError, finalize} from "rxjs/operators";

@Component({
    selector: 'app-releveactionnaire',
    templateUrl: './releveactionnaire.component.html',
    styleUrl: './releveactionnaire.component.scss',
    standalone: false
})
export class ReleveactionnaireComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
      {
        title: 'ID', data: 'idActionnaire', render: function (data, type, row) {
          return row.idActionnaire
        },
      },
      {
        title: 'N°COMPTE SGI', data: 'numCompteSgi', render: function (data, type, row) {
          return row.numCompteSgi
        },
      },
      {
        title: 'NOM / SIGLE', data: 'nomSigle', render: function (data, type, row) {
          return row.nomSigle;
        },
      },
      {
        title: 'PRENOMS / RAISON SOCIALE', data: 'prenomRaison', render: function (data, type, row) {
          return row.prenomRaison;
        },
      },
      {
        title: 'Actions', data: '', render: function (data, type, row) {
          // return row.prenomRaison;
        },
      },

    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let param = {
          idOpcvm: idOpcvm,
          ...this.form.value,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            dateDebut: new Date(param.startDate.year, param.startDate.month-1, param.startDate.day+1),
            dateFin: new Date(param.endDate.year, param.endDate.month-1, param.endDate.day+1),
          };
          console.log(param);
          const sb = this.libService.historiqueActionnaire(param)
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
      createdRow: function (row, data: any, dataIndex) {},
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
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
  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
  }
  renderActionColumn(): void {
    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      actions.render = (data: any, type: any, full: any) => {
        const parentActionStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idActionnaire}">Afficher</a>
                </li>`;
        // const edit = `
        //         <li>
        //             <a type="button" class="dropdown-item" data-action="edit" data-id="${full.codeFormeJuridique}">Modifier</a>
        //         </li>`;
        // const separator = `<li><hr class="dropdown-divider"></li>`;
        // const delete1 = `<li>
        //             <a type="button" class="dropdown-item" data-action="delete" data-id="${full.codeFormeJuridique}">Supprimer</a>
        //         </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        // actions.push(edit);
        // actions.push(separator);
        // actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
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
      (data)=>{
        this.allData=data.data;
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
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      idActionnaire:idActionnaire,
      dateDebut: new Date(param.startDate.year, param.startDate.month - 1, param.startDate.day + 1),
      dateFin: new Date(param.endDate.year, param.endDate.month - 1, param.endDate.day + 1),
    }
    //.subscribe
    const sb = this.libService.releveActionnaireEtat(param)
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
      .subscribe((response: any) => {
        console.log("Ici le retour attendu !!", response);
        this.idActionnaireTab=[]
        console.log(this.idActionnaireTab)
        /*const linkSource =
          'data:application/octet-stream;base64,' + response.data;
        const downloadLink = document.createElement('a');
        const fileName = 'listVerifDepot.pdf';

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();*/
      });
    this.subscriptions.push(sb);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    // this.renderActionColumn();
    // this.clickListener = this.renderer.listen(document, 'click', (event) => {
    //   const closestBtn = event.target.closest('.btn, .dropdown-item');
    //   if (closestBtn) {
    //     const {action, id} = closestBtn.dataset;
    //     this.idInAction = id;
    //     switch (action) {
    //       case 'view':
    //         this.router.navigate(['show', id], {relativeTo: this.route});
    //         break;
    //
    //       // case 'create':
    //       //   this.router.navigate(['new'], {relativeTo: this.route});
    //       //   break;
    //       //
    //       // case 'edit':
    //       //   this.router.navigate(['edit', id], {relativeTo: this.route});
    //       //   break;
    //
    //
    //     }
    //   }
    // });
  }
}
